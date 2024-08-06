import React, { useState } from 'react';
import { useForm } from '@inertiajs/react';

const QuestionCreate = () => {
  const [options, setOptions] = useState(['', '']);
  const { data, setData, post, processing, errors } = useForm({
    question: '',
    options: ['', ''],
    correct_answer: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('questions.store'));
  };

  const addOption = () => {
    setOptions([...options, '']);
    setData('options', [...data.options, '']);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Question</h1>
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={data.question}
          onChange={e => setData('question', e.target.value)}
          placeholder="Question"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {errors.question && <div className="text-red-500 mb-4">{errors.question}</div>}
        
        {options.map((option, index) => (
          <input
            key={index}
            type="text"
            value={data.options[index]}
            onChange={e => {
              const newOptions = [...data.options];
              newOptions[index] = e.target.value;
              setData('options', newOptions);
            }}
            placeholder={`Option ${index + 1}`}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
          />
        ))}
        <button 
          type="button" 
          onClick={addOption}
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-4"
        >
          Add Option
        </button>
        
        <select
          value={data.correct_answer}
          onChange={e => setData('correct_answer', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        >
          <option value="">Select Correct Answer</option>
          {data.options.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))}
        </select>
        {errors.correct_answer && <div className="text-red-500 mb-4">{errors.correct_answer}</div>}
        
        <button 
          type="submit" 
          disabled={processing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Create Question
        </button>
      </form>
    </div>
  );
};

export default QuestionCreate;