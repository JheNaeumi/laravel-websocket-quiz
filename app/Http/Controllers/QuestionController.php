<?php

namespace App\Http\Controllers;

use App\Models\Question;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuestionController extends Controller
{
    public function index()
    {
        $questions = Question::where('user_id', auth()->id())->get();
        return Inertia::render('Questions/Index', ['questions' => $questions]);
    }

    public function create()
    {
        return Inertia::render('Questions/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'question' => 'required|string',
            'options' => 'required|array|min:2',
            'options.*' => 'required|string',
            'correct_answer' => 'required|string',
        ]);

        Question::create([
            'user_id' => auth()->id(),
            'question' => $validated['question'],
            'options' => $validated['options'],
            'correct_answer' => $validated['correct_answer'],
        ]);

        return redirect()->route('questions.index');
    }
}