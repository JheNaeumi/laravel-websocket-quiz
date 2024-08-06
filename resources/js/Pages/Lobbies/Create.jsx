import React from 'react';
import { useForm } from '@inertiajs/react';

const LobbyCreate = () => {
  const { data, setData, post, processing, errors } = useForm({
    name: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    post(route('lobbies.store'));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Create Lobby</h1>
      {errors.error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{errors.error}</div>}
      <form onSubmit={handleSubmit} className="max-w-md">
        <input
          type="text"
          value={data.name}
          onChange={e => setData('name', e.target.value)}
          placeholder="Lobby Name"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
        />
        {errors.name && <div className="text-red-500 mb-4">{errors.name}</div>}
        <button 
          type="submit" 
          disabled={processing}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
        >
          Create
        </button>
      </form>
    </div>
  );
};

export default LobbyCreate;