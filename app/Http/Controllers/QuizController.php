<?php

namespace App\Http\Controllers;

use App\Events\NewQuizQuestion;
use App\Events\QuizEvent;
use App\Models\Lobby;
use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Lobby $lobby)
    {
        return Inertia::render('Quiz/Index', ['lobby' => $lobby->load('host', 'participants')]);
    }

    public function startQuiz(Lobby $lobby)
    {
        $question = $lobby->host->questions()->inRandomOrder()->first();

        if (!$question) {
            return response()->json(['error' => 'No questions available'], 404);
        }

        $questionData = [
            'id' => $question->id,
            'question' => $question->question,
            'options' => $question->options,
        ];

        broadcast(new QuizEvent($questionData, $lobby->id))->toOthers();
        return response()->json($questionData);
    }

    public function submitAnswer(Request $request, Lobby $lobby)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'answer' => 'required|string',
        ]);

        $question = Question::findOrFail($validated['question_id']);
        $isCorrect = $question->correct_answer === $validated['answer'];

        // Here you could update user scores or track correct answers

        return response()->json(['correct' => $isCorrect]);
    }
}