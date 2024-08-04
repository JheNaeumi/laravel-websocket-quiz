<?php

namespace App\Http\Controllers;

use App\Models\Lobby;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LobbyController extends Controller
{
    public function index()
    {
        $lobbies = Lobby::where('is_active', true)->with('host')->get();
        return Inertia::render('Lobbies/Index', ['lobbies' => $lobbies]);
    }

    public function create()
    {
        return Inertia::render('Lobbies/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $lobby = Lobby::create([
            'name' => $validated['name'],
            'host_id' => auth()->id(),
        ]);

        return redirect()->route('lobbies.show', $lobby);
    }

    public function show(Lobby $lobby)
    {
        $lobby->load('host');
        return Inertia::render('Lobbies/Show', ['lobby' => $lobby]);
    }

    public function join(Lobby $lobby)
    {
        $user = auth()->user();
        if (!$lobby->participants->contains($user->id)) {
            $lobby->participants()->attach($user->id);
        }
        return redirect()->route('lobbies.show', $lobby);
    }
}