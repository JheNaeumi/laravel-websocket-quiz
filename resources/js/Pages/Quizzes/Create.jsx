// resources/js/Pages/Quizzes/Create.jsx

import React, { useState } from 'react';
import { router } from '@inertiajs/react';

export default function Create({auth}) {
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
        
        <div>
            <h1>Create a New Quiz</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Quiz Title:</label>
                    <input
                        type="text"
                        id="title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                </div>
                {questions.map((question, questionIndex) => (
                    <div key={questionIndex}>
                        <h3>Question {questionIndex + 1}</h3>
                        <input
                            type="text"
                            value={question.question}
                            onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                            placeholder="Enter question"
                            required
                        />
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
                        <div>
                            <label>Correct Answer:</label>
                            <select
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
                        <div>
                            <label>Time Limit (seconds):</label>
                            <input
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
                <button type="button" onClick={addQuestion}>Add Question</button>
                <button type="submit">Create Quiz</button>
            </form>
        </div>
    );
}