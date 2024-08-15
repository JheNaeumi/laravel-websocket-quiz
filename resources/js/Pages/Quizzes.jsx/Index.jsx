import React from 'react';
import { Link } from '@inertiajs/react';

export default function Index({ quizzes }) {
    return (
        <div>
            <h1>Quizzes</h1>
            <ul>
                {quizzes.map((quiz) => (
                    <li key={quiz.id}>
                        <Link href={route('quizzes.show', quiz.id)}>{quiz.title}</Link>
                    </li>
                ))}
            </ul>
        </div>
    );
}