import React from 'react';
import { Link, Head } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, quizzes }) {
    return (
        <AuthenticatedLayout
        user={auth.user}
        header={<h2 className="font-semibold text-xl text-gray-800 leading-tight">Quiz</h2>}
        >
        <Head title="Quiz" />
        
        <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <div className="bg-white overflow-hidden shadow-sm sm:rounded-lg">
                        <div className='p-6'>
                            <div className='flex justify-between'>
                                <h1 className='text-lg font-medium mb-4 text-gray-900'>Quizzes</h1>
                                <Link className="text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" href={route('quizzes.create')}>Create New Quiz</Link>
                            </div>
                            <ul className='mt-4'>
                                {quizzes.map((quiz) => (
                                    <li className='"border rounded-lg py-3 mb-4 px-2 bg-slate-100' key={quiz.id}>
                                        <Link href={route('quizzes.show', quiz.id)}>{quiz.title}</Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
        </div>
        </AuthenticatedLayout>
    );
}