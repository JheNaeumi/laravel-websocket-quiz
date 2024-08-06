import React from 'react';
import { Link } from '@inertiajs/react';

const LobbiesIndex = ({ lobbies }) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Lobbies</h1>
      <Link 
        href={route('lobbies.create')} 
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4 inline-block"
      >
        Create New Lobby
      </Link>
      <ul className="space-y-4">
        {lobbies.map(lobby => (
          <li key={lobby.id} className="bg-white shadow-md rounded-lg p-4">
            <Link 
              href={route('lobbies.show', lobby.id)}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {lobby.name}
            </Link>
            <span className="ml-2 text-gray-600"> - Hosted by: {lobby.host.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LobbiesIndex;