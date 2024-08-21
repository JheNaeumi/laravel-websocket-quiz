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
            <div>
                <h1>{quiz.title}</h1>
                <h1>Hosts id:{quiz.user_id}</h1>
                <h1>Your id:{auth.user.id}</h1>

                {auth.user.id === quiz.user_id ? (
                    <div>
                        <p>Waiting for participants to join...</p>
                        <button onClick={() =>router.post(route('quizzes.start', quiz.id))}>Start Quiz</button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="text"
                            value={participantName}
                            onChange={(e) => setParticipantName(e.target.value)}
                            placeholder="Enter your name"
                        />
                        <button onClick={handleJoin}>Join Quiz</button>
                    </div>
                )}
                <h2>Participants:</h2>
                <ul>
                    {participants.map((name, index) => (
                        <li key={index}>{name}</li>
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
                <div>
                    <h1>{quiz.title} - Results</h1>
                    <h2>Quiz Completed</h2>
                    <h3>Participant Scores:</h3>
                    <ul>
                        {Object.entries(participantAnswers).map(([name, answers]) => (
                            <li key={name}>
                                {name}: {calculateScore(answers)} / {quiz.questions.length}
                            </li>
                        ))}
                    </ul>
                    <h3>Question Breakdown:</h3>
                    {quiz.questions.map((question, index) => (
                        <div key={index}>
                            <h4>Question {index + 1}: {question.question}</h4>
                            <p>Correct Answer: {question.correct_answer}</p>
                            <ul>
                                {Object.entries(participantAnswers).map(([name, answers]) => (
                                    <li key={name}>
                                        {name}: {answers[index] || 'No answer'} 
                                        {answers[index] === question.correct_answer ? ' ✅' : ' ❌'}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                    <button onClick={() => router.get(route('quizzes.index'))}>Back to Quizzes</button>
                </div>
            );
        } else {
            // Participant view
            return (
                <div>
                    <h1>{quiz.title} - Your Results</h1>
                    <h2>Quiz Completed</h2>
                    <p>Your score: {calculateScore(participantAnswers[auth.user.name])} / {quiz.questions.length}</p>
                    <h3>Your Answers:</h3>
                    {quiz.questions.map((question, index) => (
                        <div key={index}>
                            <h4>Question {index + 1}: {question.question}</h4>
                            <p>Your Answer: {participantAnswers[auth.user.name][index] || 'No answer'}</p>
                            <p>Correct Answer: {question.correct_answer}</p>
                            {participantAnswers[auth.user.name][index] === question.correct_answer ? 
                                <p style={{color: 'green'}}>Correct! ✅</p> : 
                                <p style={{color: 'red'}}>Incorrect ❌</p>
                            }
                        </div>
                    ))}
                    <button onClick={submitResult}>Submit Result</button>
                    <button onClick={() => router.get(route('quizzes.index'))}>Back to Quizzes</button>
                </div>
            );
        }
    }

 
    return (
        <div>
            <h1>{quiz.title}</h1>
            <div>
                <h2>Question {currentQuestion} of {quiz.questions.length}</h2>
                <p>{quiz.questions[currentQuestion].question}</p>
                <p>Time left: {timeLeft} seconds</p>
                
                {auth.user.id !== quiz.user_id && (
                    <div>
                        {quiz.questions[currentQuestion].options.map((option, index) => (
                            <button
                                key={index}
                                onClick={() => handleAnswerSelect(option, currentQuestion)}
                                disabled={selectedAnswer !== ''}
                            >
                                {option}
                            </button>
                        ))}
                        {selectedAnswer && <p>Your answer: {selectedAnswer}</p>}
                    </div>
                )}
    
                {auth.user.id === quiz.user_id && (
                    <div>
                        <h3>Participant Answers:</h3>
                        <table>
                            <thead>
                                <tr>
                                    <th>Participant</th>
                                    <th>Answer</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Object.entries(participantAnswers).map(([name, answers]) => (
                                    <tr key={name}>
                                        <td>{name}</td>
                                        <td>{answers[currentQuestion] || 'No answer yet'}</td>
                                        <td>
                                            {answers[currentQuestion] 
                                                ? (answers[currentQuestion] === quiz.questions[currentQuestion].correct_answer 
                                                    ? '✅ Correct' 
                                                    : '❌ Incorrect')
                                                : '⏳ Waiting'
                                            }
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <button onClick={handleNextQuestion}>Next Question</button>
                    </div>
                )}
            </div>
        </div>
    );
}