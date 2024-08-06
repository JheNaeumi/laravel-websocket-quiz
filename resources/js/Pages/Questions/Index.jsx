import React from 'react';
import { Link } from '@inertiajs/react';

const QuestionsIndex = ({ questions }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">My Questions</h1>
      <Link 
        href={route('questions.create')}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Create New Question
      </Link>
      <ul className="space-y-4">
        {questions.map(question => (
          <li key={question.id} className="bg-white shadow-md rounded-lg p-4">
            {question.question}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default QuestionsIndex;