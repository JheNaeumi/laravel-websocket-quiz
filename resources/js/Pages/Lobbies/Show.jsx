import React from 'react';
import { Link, useForm } from '@inertiajs/react';

const LobbyShow = ({ lobby, isHost }) => {
    const { post } = useForm();

    const handleReady = () => {
      post(route('lobbies.ready', lobby.id));
    };
  return (

    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">{lobby.name}</h1>
      <p className="text-gray-600 mb-6">Hosted by: {lobby.host.name}</p>
      <div className="space-x-4">
        {!isHost && (
           <button
           onClick={handleReady}
           className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
         >
           I'm Ready
         </button>
        )}
        <Link 
          href={route('quiz.index', lobby.id)}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          {isHost ? 'Start Quiz' : 'Enter Quiz Room'}
        </Link>
      </div>
    </div>
  );
};

export default LobbyShow;