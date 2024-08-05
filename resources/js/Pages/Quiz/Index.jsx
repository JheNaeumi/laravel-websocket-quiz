import React, { useState, useEffect } from 'react';
import { usePage } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import axios from 'axios';

export default function QuizIndex({ lobby }) {
    const { auth } = usePage().props;
    const [question, setQuestion] = useState(null);
    const [selectedAnswer, setSelectedAnswer] = useState('');
    const [result, setResult] = useState(null);

    useEffect(() => {
        const channel = window.Echo.channel(`lobby.${lobby.id}`);
        channel.listen('QuizEvent', (event) => {
            setQuestion(event.question);
            setSelectedAnswer('');
            setResult(null);
        });
        channel.listen('QuizResults', (event) => {
            setResult(event.results);
        });

        return () => {
            channel.stopListening('QuizEvent');
            channel.stopListening('QuizResults');
        };
    }, [lobby.id]);

    const startQuiz = async () => {
        try {
            const response = await axios.post(route('quiz.start', lobby.id));
            setQuestion(response.data);
        } catch (error) {
            console.error('Error starting quiz:', error);
        }
    };

    const submitAnswer = async () => {
        try {
            const response = await axios.post(route('quiz.answer', lobby.id), {
                question_id: question.id,
                answer: selectedAnswer,
            });
            setResult(response.data);
        } catch (error) {
            console.error('Error submitting answer:', error);
        }
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-4">Quiz: {lobby.name}</h1>
                    {auth.user.id === lobby.host_id && (
                        <button onClick={startQuiz} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                            Start Quiz
                        </button>
                    )}
                    {question && (
                        <div className="mt-4">
                            <h2 className="text-xl">{question.question}</h2>
                            <div className="mt-2">
                                {question.options.map((option, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setSelectedAnswer(option)}
                                        className={`mr-2 mt-2 px-4 py-2 rounded ${selectedAnswer === option ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                    >
                                        {option}
                                    </button>
                                ))}
                            </div>
                            <button onClick={submitAnswer} className="mt-4 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                                Submit Answer
                            </button>
                        </div>
                    )}
                    {result && (
                        <div className="mt-4">
                            <h3 className="text-lg font-semibold">
                                {result.correct ? 'Correct!' : 'Incorrect!'}
                            </h3>
                        </div>
                    )}
                </div>
            </div>
        </AuthenticatedLayout>
    );
}