<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use Inertia\Inertia;
use App\Events\QuizStarted;
use App\Events\QuizChanged;
use App\Events\QuizEnded;

class QuizController extends Controller
{
    //
    public function index()
    {
        $quizzes = Quiz::all();
        return Inertia::render('Quizzes/Index', ['quizzes' => $quizzes]);
       
    }

    public function show(Quiz $quiz)
    {
        $quiz->load('questions');
        return Inertia::render('Quizzes/Show', ['quiz' => $quiz]);
    }

    public function start(Quiz $quiz)
    {
        broadcast(new QuizStarted($quiz));
        return response()->json(['message' => 'Quiz started']);
    }

    public function nextQuestion(Quiz $quiz, $questionNumber)
    {
        broadcast(new QuizChanged($quiz, $questionNumber));
        return response()->json(['message' => 'Question changed']);
    }

    public function end(Quiz $quiz)
    {
        broadcast(new QuizEnded($quiz));
        return response()->json(['message' => 'Quiz ended']);
    }
}
