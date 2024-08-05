import React from 'react';
import { useForm } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Create({ auth }) {
    const { data, setData, post, processing, errors } = useForm({
        question: '',
        options: ['', ''],
        correct_answer: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('questions.store'));
    };

    const addOption = () => {
        setData('options', [...data.options, '']);
    };

    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-4">Create Question</h1>
                    <form onSubmit={submit}>
                        <div>
                            <label htmlFor="question">Question</label>
                            <input
                                id="question"
                                type="text"
                                value={data.question}
                                onChange={e => setData('question', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            {errors.question && <div className="text-red-500">{errors.question}</div>}
                        </div>
                        <div className="mt-4">
                            <label>Options</label>
                            {data.options.map((option, index) => (
                                <input
                                    key={index}
                                    type="text"
                                    value={option}
                                    onChange={e => {
                                        const newOptions = [...data.options];
                                        newOptions[index] = e.target.value;
                                        setData('options', newOptions);
                                    }}
                                    className="mt-1 block w-full"
                                />
                            ))}
                            <button type="button" onClick={addOption} className="mt-2 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
                                Add Option
                            </button>
                        </div>
                        <div className="mt-4">
                            <label htmlFor="correct_answer">Correct Answer</label>
                            <input
                                id="correct_answer"
                                type="text"
                                value={data.correct_answer}
                                onChange={e => setData('correct_answer', e.target.value)}
                                className="mt-1 block w-full"
                            />
                            {errors.correct_answer && <div className="text-red-500">{errors.correct_answer}</div>}
                        </div>
                        <div className="mt-4">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" disabled={processing}>
                                Create
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}