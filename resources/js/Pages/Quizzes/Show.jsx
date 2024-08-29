import React, { useState, useEffect } from 'react';
import { router } from '@inertiajs/react';

export default function Show({ quiz, auth}) {
    //const { auth } = usePage().props;
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(quiz.questions[0].time_limit);
    const [quizStatus, setQuizStatus] = useState('waiting');
    const [participants, setParticipants] = useState([]);
    const [participantName, setParticipantName] = useState('');
    const [participantAnswers, setParticipantAnswers] = useState({});
    //Websocket/Channel
    useEffect(() => {

        const channel = window.Echo.channel(`quizzes.${quiz.id}`);

        channel.listen('QuizStarted', () => {
            setQuizStatus('started');
        });

        channel.listen('QuizChanged', (e) => {
            console.log(e.questionNumber)
            setCurrentQuestion(e.questionNumber);
            setTimeLeft(quiz.questions[e.questionNumber].time_limit);
            setSelectedAnswer('');
        });

        channel.listen('QuizEnded', () => {
            setQuizStatus('ended');
        });

        channel.listen('UserJoinedQuiz', (e) => {
            setParticipants(prevParticipants => [...prevParticipants, e.participantName]);
        });

        channel.listen('ParticipantAnswered', (e) => {
            setSelectedAnswer(e.answer)
            setParticipantAnswers(prevAnswers => ({
                ...prevAnswers,
                [e.participant_name]: {
                    ...prevAnswers[e.participant_name],
                    [e.question_index]: e.answer
                }
            }));
        });
        return () => {
            channel.stopListening('QuizStarted');
            channel.stopListening('QuestionChanged');
            channel.stopListening('QuizEnded');
            channel.stopListening('UserJoinedQuiz');
            channel.stopListening('ParticipantAnswered');
        };
    }, []);
    //Question Timer
    useEffect(() => {
        if (quizStatus !== 'started') return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 0) {
                    handleNextQuestion();
                    return quiz.questions[currentQuestion]?.time_limit || 0;
             
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, quizStatus]);

    const handleAnswerSelect = (answer, question_index) => {
     
        if (auth.user.id !== quiz.user_id) {
            
            router.post(route('quizzes.answer', quiz.id), {
                participant_name: auth.user.name,
                answer: answer,
                question_index: question_index
            }, {
                preserveState: true,
                preserveScroll: true,
            });
        }
        
        
    
    };

    const handleNextQuestion = () => {
     
        setScore(prevScore => {
            if (selectedAnswer === quiz.questions[currentQuestion].correct_answer) {
                return prevScore + 1;
            }
            return prevScore;
        });
        if (currentQuestion < quiz.questions.length - 1 ) {
            let nextQuestion = currentQuestion;
            nextQuestion++;
            console.log(nextQuestion);
            router.post(route('quizzes.nextQuestion', { quiz: quiz.id, questionNumber: nextQuestion }));
      
           
        } else {
            router.post(route('quizzes.end', quiz.id), {
                selectedAnswer: selectedAnswer,
                currentQuestion: currentQuestion
            }, {
                onSuccess: () => {
                    setQuizStatus('ended');
                }
            });
        }
        
    };

    const submitResult = () => {
    router.post(route('results.store'), {
            quiz_id: quiz.id,
            participant_name: auth.user.name,
            score: score,
        });
    };

    const handleJoin = () => {
    router.post(route('quizzes.join', quiz.id), { participant_name: participantName }, {
            preserveState: true,
            preserveScroll: true,
        });
    };
    const calculateScore = (answers) => {
        return quiz.questions.reduce((score, question, index) => {
            return score + (answers[index]=== question.correct_answer ? 1 : 0);
        }, 0);
    };

    
    if (quizStatus === 'waiting') {
        return (
            <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                <h1 className="text-3xl font-bold text-gray-800">{quiz.title}</h1>
                <h1 className="text-lg font-medium text-gray-600 mt-2">Host's ID: {quiz.user_id}</h1>
                <h1 className="text-lg font-medium text-gray-600 mt-2">Your ID: {auth.user.id}</h1>
    
                {auth.user.id === quiz.user_id ? (
                    <div className="mt-4">
                        <p className="text-gray-700">Waiting for participants to join...</p>
                        <button 
                            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                            onClick={() => router.post(route('quizzes.start', quiz.id))}
                        >
                            Start Quiz
                        </button>
                    </div>
                ) : (
                    <div className="mt-4">
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <button 
                            className="mt-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                            onClick={handleJoin}
                        >
                            Join Quiz
                        </button>
                    </div>
                )}
                <h2 className="text-xl font-semibold text-gray-700 mt-6">Participants:</h2>
                <ul className="mt-4 space-y-2">
                    {participants.map((name, index) => (
                        <li key={index} className="text-gray-700 p-2 bg-gray-100 rounded-md shadow-sm">
                            {name}
                        </li>
                    ))}
                </ul>
            </div>
        );
    }
    
   
    // update frontend
    if (quizStatus === 'ended') {
        if (auth.user.id === quiz.user_id) {
            // Host view
            return (
                <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                    <h1 className="text-3xl font-bold text-gray-800">{quiz.title} - Results</h1>
                    <h2 className="text-xl font-semibold text-gray-700 mt-4">Quiz Completed</h2>
                    <h3 className="text-lg font-medium text-gray-600 mt-4">Participant Scores:</h3>
                    <ul className="mt-4 space-y-2">
                        {Object.entries(participantAnswers).map(([name, answers]) => (
                            <li key={name} className="p-2 bg-gray-100 rounded-md shadow-sm">
                                {name}: {calculateScore(answers)} / {quiz.questions.length}
                            </li>
                        ))}
                    </ul>
                    <h3 className="text-lg font-medium text-gray-600 mt-6">Question Breakdown:</h3>
                    {quiz.questions.map((question, index) => (
                        <div key={index} className="mt-4 p-4 bg-gray-50 rounded-md shadow">
                            <h4 className="text-md font-semibold text-gray-800">
                                Question {index + 1}: {question.question}
                            </h4>
                            <p className="text-gray-600 mt-1">Correct Answer: {question.correct_answer}</p>
                            <ul className="mt-2 space-y-2">
                                {Object.entries(participantAnswers).map(([name, answers]) => (
                                    <li key={name} className="text-gray-700">
                                        {name}: {answers[index] || 'No answer'} 
                                        {answers[index] === question.correct_answer ? ' ✅' : ' ❌'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button 
                        className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                        onClick={() => router.get(route('quizzes.index'))}
                    >
                        Back to Quizzes
                    </button>
                </div>
            );
            } else { 
                // Participant view
                return (
                    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
                        <h1 className="text-3xl font-bold text-gray-800">{quiz.title} - Your Results</h1>
                        <h2 className="text-xl font-semibold text-gray-700 mt-4">Quiz Completed</h2>
                        <p className="mt-4 text-lg text-gray-600">
                            Your score: {calculateScore(participantAnswers[auth.user.name])} / {quiz.questions.length}
                        </p>
                        <h3 className="text-lg font-medium text-gray-600 mt-6">Your Answers:</h3>
                        {quiz.questions.map((question, index) => (
                            <div key={index} className="mt-4 p-4 bg-gray-50 rounded-md shadow">
                                <h4 className="text-md font-semibold text-gray-800">
                                    Question {index + 1}: {question.question}
                                </h4>
                                <p className="text-gray-600 mt-1">Your Answer: {participantAnswers[auth.user.name][index] || 'No answer'}</p>
                                <p className="text-gray-600">Correct Answer: {question.correct_answer}</p>
                                {participantAnswers[auth.user.name][index] === question.correct_answer ? 
                                    <p className="text-green-500 font-semibold">Correct! ✅</p> : 
                                    <p className="text-red-500 font-semibold">Incorrect ❌</p>
                                }
                            </div>
                        ))}
                        <div className="flex space-x-4 mt-6">
                            <button 
                                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-all"
                                onClick={submitResult}
                            >
                                Submit Result
                            </button>
                            <button 
                                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                                onClick={() => router.get(route('quizzes.index'))}
                            >
                                Back to Quizzes
                            </button>
                        </div>
                    </div>
                );
        }
    }


    return (
        <div className="max-w-3xl mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">{quiz.title}</h1>
            <div>
                <h2 className="text-2xl font-semibold text-gray-700 mb-2">
                    Question {Number(currentQuestion) + 1} of {quiz.questions.length}
                </h2>
                <p className="text-lg text-gray-600 mb-4">{quiz.questions[currentQuestion].question}</p>
                <p className="text-sm text-gray-500 mb-6">Time left: {timeLeft} seconds</p>
                
                {auth.user.id !== quiz.user_id && (
                    <div className="space-y-4">
                        {quiz.questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option, currentQuestion)}
                                disabled={selectedAnswer !== ''}
                                className={`w-full py-2 px-4 rounded-md text-white font-medium ${
                                    selectedAnswer === option
                                        ? 'bg-green-500'
                                        : 'bg-blue-500 hover:bg-blue-600'
                                } ${selectedAnswer !== '' && selectedAnswer !== option ? 'opacity-50 cursor-not-allowed' : ''}`}
                            >
                                {option}
                            </button>
                        ))}
                        {selectedAnswer && (
                            <p className="mt-4 text-lg text-gray-700 font-semibold">Your answer: {selectedAnswer}</p>
                        )}
                    </div>
                )}
    
                {auth.user.id === quiz.user_id && (
                    <div className="mt-6">
                        <h3 className="text-lg font-medium text-gray-700">Participant Answers:</h3>
                        <div className="overflow-x-auto mt-4">
                            <table className="min-w-full bg-white border border-gray-200">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="py-2 px-4 border-b">Participant</th>
                                        <th className="py-2 px-4 border-b">Answer</th>
                                        <th className="py-2 px-4 border-b">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {Object.entries(participantAnswers).map(([name, answers]) => (
                                        <tr key={name}>
                                            <td className="py-2 px-4 border-b text-gray-700">{name}</td>
                                            <td className="py-2 px-4 border-b text-gray-700">
                                                {answers[currentQuestion] || 'No answer yet'}
                                            </td>
                                            <td className="py-2 px-4 border-b text-gray-700">
                                                {answers[currentQuestion] 
                                                    ? (answers[currentQuestion] === quiz.questions[currentQuestion].correct_answer 
                                                        ? '✅ Correct' 
                                                        : '❌ Incorrect')
                                                    : '⏳ Waiting'}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <button 
                            className="mt-6 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
                            onClick={handleNextQuestion}
                        >
                            Next Question
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
    
}