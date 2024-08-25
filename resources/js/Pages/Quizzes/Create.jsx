// resources/js/Pages/Quizzes/Create.jsx

import React, { useState } from 'react';
import { router , Head, Link} from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const [title, setTitle] = useState('');
    const [questions, setQuestions] = useState([{ question: '', options: ['', ''], correct_answer: '', time_limit: 30 }]);
    const id = auth.user.id;
    const addQuestion = () => {
        setQuestions([...questions, { question: '', options: ['', ''], correct_answer: '', time_limit: 30 }]);
    };

    const updateQuestion = (index, field, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[index][field] = value;
        setQuestions(updatedQuestions);
    };

    const addOption = (questionIndex) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options.push('');
        setQuestions(updatedQuestions);
    };

    const updateOption = (questionIndex, optionIndex, value) => {
        const updatedQuestions = [...questions];
        updatedQuestions[questionIndex].options[optionIndex] = value;
        setQuestions(updatedQuestions);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        router.post(route('quizzes.store'), { title, questions, id});
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quiz</h2>}
        >
            <Head title="Quiz" />
            <div className='py-12'>
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='px-12'>
                            <h1 className='my-8 text-gray-900 font-medium text-xl'>Create a New Quiz</h1>
                            <form onSubmit={handleSubmit}>
                                <div className='my-4'>
                                    <label htmlFor="title">Quiz Title:</label>
                                    <input className='ml-4'
                                        type="text"
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                    />
                                </div>
                                {questions.map((question, questionIndex) => (
                                    <div key={questionIndex}>
                                        <div>
                                        <h3>Question {questionIndex + 1}</h3>
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                            placeholder="Enter question"
                                            required
                                        />
                                        </div>
                                        <div>
                                            {question.options.map((option, optionIndex) => (
                                                <input
                                                    key={optionIndex}
                                                    type="text"
                                                    value={option}
                                                    onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                    placeholder={`Option ${optionIndex + 1}`}
                                                    required
                                                />
                                            ))}
                                            <button type="button" onClick={() => addOption(questionIndex)}>Add Option</button>
                                        </div>
                                        <div className='my-4'>
                                            <label>Correct Answer:</label>
                                            <select className='mx-4'
                                                value={question.correct_answer}
                                                onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
                                                required
                                            >
                                                <option value="">Select correct answer</option>
                                                {question.options.map((option, optionIndex) => (
                                                    <option key={optionIndex} value={option}>{option}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className='my-4'>
                                            <label>Time Limit (seconds):</label>
                                            <input className='mx-4'
                                                type="number"
                                                value={question.time_limit}
                                                onChange={(e) => updateQuestion(questionIndex, 'time_limit', parseInt(e.target.value))}
                                                min="5"
                                                max="300"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                                <div className='mt-4'>
                                    <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addQuestion}>Add Question</button>
                                    <button type="submit" className='text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>Create Quiz</button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}