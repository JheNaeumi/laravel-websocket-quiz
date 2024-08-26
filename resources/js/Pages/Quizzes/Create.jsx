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
        // <AuthenticatedLayout
        //     user={auth.user}
        //     header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quiz</h2>}
        // >
        //     <Head title="Quiz" />
        //     <div className='py-12'>
        //         <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
        //             <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
        //                 <div className='px-12'>
        //                     <h1 className='my-8 text-gray-900 font-medium text-xl'>Create a New Quiz</h1>
        //                     <form onSubmit={handleSubmit}>
        //                         <div className='my-4'>
        //                             <label htmlFor="title">Quiz Title:</label>
        //                             <input className='ml-4'
        //                                 type="text"
        //                                 id="title"
        //                                 value={title}
        //                                 onChange={(e) => setTitle(e.target.value)}
        //                                 required
        //                             />
        //                         </div>
        //                         {questions.map((question, questionIndex) => (
        //                             <div key={questionIndex}>
        //                                 <div>
        //                                 <h3>Question {questionIndex + 1}</h3>
        //                                 <input
        //                                     type="text"
        //                                     value={question.question}
        //                                     onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
        //                                     placeholder="Enter question"
        //                                     required
        //                                 />
        //                                 </div>
        //                                 <div>
        //                                     {question.options.map((option, optionIndex) => (
        //                                         <input
        //                                             key={optionIndex}
        //                                             type="text"
        //                                             value={option}
        //                                             onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
        //                                             placeholder={`Option ${optionIndex + 1}`}
        //                                             required
        //                                         />
        //                                     ))}
        //                                     <button type="button" onClick={() => addOption(questionIndex)}>Add Option</button>
        //                                 </div>
        //                                 <div className='my-4'>
        //                                     <label>Correct Answer:</label>
        //                                     <select className='mx-4'
        //                                         value={question.correct_answer}
        //                                         onChange={(e) => updateQuestion(questionIndex, 'correct_answer', e.target.value)}
        //                                         required
        //                                     >
        //                                         <option value="">Select correct answer</option>
        //                                         {question.options.map((option, optionIndex) => (
        //                                             <option key={optionIndex} value={option}>{option}</option>
        //                                         ))}
        //                                     </select>
        //                                 </div>
        //                                 <div className='my-4'>
        //                                     <label>Time Limit (seconds):</label>
        //                                     <input className='mx-4'
        //                                         type="number"
        //                                         value={question.time_limit}
        //                                         onChange={(e) => updateQuestion(questionIndex, 'time_limit', parseInt(e.target.value))}
        //                                         min="5"
        //                                         max="300"
        //                                         required
        //                                     />
        //                                 </div>
        //                             </div>
        //                         ))}
        //                         <div className='mt-4'>
        //                             <button type="button" className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={addQuestion}>Add Question</button>
        //                             <button type="submit" className='text-white bg-green-700 hover:bg-green-800 focus:outline-none focus:ring-4 focus:ring-green-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800'>Create Quiz</button>
        //                         </div>
        //                     </form>
        //                 </div>
        //             </div>
        //         </div>
        //     </div>
        // </AuthenticatedLayout>
        <AuthenticatedLayout
            user={auth.user}
            header={<h2 className="font-semibold text-2xl text-gray-800 leading-tight">Quiz</h2>}
        >
        <Head title="Quiz" />
        <div className='py-12'>
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow-lg rounded-lg p-8">
                    <h1 className='text-3xl font-semibold text-gray-900 mb-8'>Create a New Quiz</h1>
                    <form onSubmit={handleSubmit}>
                        <div className='grid gap-6 mb-6'>
                            <div>
                                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Quiz Title</label>
                                <input 
                                    className='mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                    type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>
                            {questions.map((question, questionIndex) => (
                                <div key={questionIndex} className='bg-gray-50 p-6 rounded-lg shadow-inner'>
                                    <h3 className='text-lg font-semibold mb-4'>Question {questionIndex + 1}</h3>
                                    <div className='mb-4'>
                                        <input
                                            type="text"
                                            className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                            value={question.question}
                                            onChange={(e) => updateQuestion(questionIndex, 'question', e.target.value)}
                                            placeholder="Enter question"
                                            required
                                        />
                                    </div>
                                    <div className='grid grid-cols-2 gap-4 mb-4'>
                                        {question.options.map((option, optionIndex) => (
                                            <input
                                                key={optionIndex}
                                                type="text"
                                                className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                                value={option}
                                                onChange={(e) => updateOption(questionIndex, optionIndex, e.target.value)}
                                                placeholder={`Option ${optionIndex + 1}`}
                                                required
                                            />
                                        ))}
                                        <button 
                                            type="button" 
                                            className="text-sm text-blue-600 hover:text-blue-800 focus:outline-none"
                                            onClick={() => addOption(questionIndex)}
                                        >
                                            + Add Option
                                        </button>
                                    </div>
                                    <div className='mb-4'>
                                        <label className="block text-sm font-medium text-gray-700">Correct Answer</label>
                                        <select
                                            className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
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
                                        <label className="block text-sm font-medium text-gray-700">Time Limit (seconds)</label>
                                        <input
                                            type="number"
                                            className='block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm'
                                            value={question.time_limit}
                                            onChange={(e) => updateQuestion(questionIndex, 'time_limit', parseInt(e.target.value))}
                                            min="5"
                                            max="300"
                                            required
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className='flex justify-between items-center'>
                            <button 
                                type="button" 
                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                onClick={addQuestion}
                            >
                                + Add Question
                            </button>
                            <button 
                                type="submit" 
                                className="inline-flex items-center justify-center px-5 py-2.5 border border-transparent text-sm font-medium rounded-full text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                            >
                                Create Quiz
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
        </AuthenticatedLayout>

    );
}