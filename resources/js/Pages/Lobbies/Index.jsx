import React from 'react';
import { Link } from '@inertiajs/react';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';

export default function Index({ auth, lobbies }) {
    return (
        <AuthenticatedLayout user={auth.user}>
            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <h1 className="text-2xl font-semibold mb-4">Lobbies</h1>
                    <Link href={route('lobbies.create')} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                        Create Lobby
                    </Link>
                    <div className="mt-4">
                        {lobbies.map(lobby => (
                            <div key={lobby.id} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
                                <h2 className="text-xl">{lobby.name}</h2>
                                <p>Hosted by: {lobby.host.name}</p>
                                <Link href={route('lobbies.join', lobby.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-2 inline-block">
                                    Join
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}