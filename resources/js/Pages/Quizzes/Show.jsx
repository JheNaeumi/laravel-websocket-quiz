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

    useEffect(() => {
        // const echo = new Echo({
        //     broadcaster: 'reverb',
        //     key: process.env.MIX_REVERB_APP_KEY,
        //     wsHost: process.env.MIX_REVERB_HOST,
        //     wsPort: process.env.MIX_REVERB_PORT,
        //     forceTLS: false,
        //     disableStats: true,
        // });

        const channel = window.Echo.channel(`quizzes.${quiz.id}`);

        channel.listen('QuizStarted', () => {
            setQuizStatus('started');
        });

        channel.listen('QuestionChanged', (e) => {
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

        return () => {
            channel.stopListening('QuizStarted');
            channel.stopListening('QuestionChanged');
            channel.stopListening('QuizEnded');
            channel.stopListening('UserJoinedQuiz');
        };
    }, []);

    useEffect(() => {
        if (quizStatus !== 'started') return;

        const timer = setInterval(() => {
            setTimeLeft((prevTime) => {
                if (prevTime === 0) {
                    handleNextQuestion();
                    return quiz.questions[currentQuestion + 1]?.time_limit || 0;
                }
                return prevTime - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [currentQuestion, quizStatus]);

    const handleAnswerSelect = (answer) => {
        setSelectedAnswer(answer);
    };

    const handleNextQuestion = () => {
        if (selectedAnswer === quiz.questions[currentQuestion].correct_answer) {
            setScore(score + 1);
        }

        if (currentQuestion + 1 < quiz.questions.length) {
        router.post(route('quizzes.nextQuestion', { quiz: quiz.id, questionNumber: currentQuestion + 1 }));
        } else {
        router.post(route('quizzes.end', quiz.id));
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

    if (quizStatus === 'ended') {
        return (
            <div>
                <h1>{quiz.title}</h1>
                <h2>Quiz Completed</h2>
                <p>Your score: {score}/{quiz.questions.length}</p>
                <button onClick={submitResult}>Submit Result</button>
            </div>
        );
    }

    return (
        <div>
            <h1>{quiz.title}</h1>
            <div>
                <h2>Question {currentQuestion + 1}</h2>
                <p>{quiz.questions[currentQuestion].question}</p>
                <p>Time left: {timeLeft} seconds</p>
                {quiz.questions[currentQuestion].options.map((option, index) => (
                    <button
                        key={index}
                        onClick={() => handleAnswerSelect(option)}
                        disabled={selectedAnswer !== ''}
                    >
                        {option}
                    </button>
                ))}
                <button onClick={handleNextQuestion}>Next</button>
            </div>
        </div>
    );
}