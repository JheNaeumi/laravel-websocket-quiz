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
        <div>
            <h1>Quizzes</h1>
          
            <Link href={route('quizzes.create')}>Create New Quiz</Link>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <Link href={route('quizzes.show', quiz.id)}>{quiz.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
        </AuthenticatedLayout>
    );
}