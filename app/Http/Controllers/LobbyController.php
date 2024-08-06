<?php

namespace App\Http\Controllers;

use App\Models\Lobby;
use App\Models\Question;
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
        $user = auth()->user();
        $questionCount = Question::where('user_id', $user->id)->count();

        if ($questionCount === 0) {
            return redirect()->route('questions.create')->with('error', 'You need to create at least one question before creating a lobby.');
        }

        return Inertia::render('Lobbies/Create');
    }

    public function store(Request $request)
    {
        $user = auth()->user();
        $questionCount = Question::where('user_id', $user->id)->count();

        if ($questionCount === 0) {
            return back()->with('error', 'You need to create at least one question before creating a lobby.');
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255',
        ]);

        $lobby = Lobby::create([
            'name' => $validated['name'],
            'host_id' => $user->id,
        ]);

        return redirect()->route('lobbies.show', $lobby);
    }

    public function show(Lobby $lobby)
    {
        $lobby->load('host', 'participants');
        $isHost = $lobby->host_id === auth()->id();
        return Inertia::render('Lobbies/Show', ['lobby' => $lobby, 'isHost' => $isHost]);
    }

    public function setReady(Request $request, Lobby $lobby)
    {
        $user = auth()->user();
        $lobby->participants()->updateExistingPivot($user->id, ['ready' => true]);
        return redirect()->route('quiz.index', $lobby);
    }
}