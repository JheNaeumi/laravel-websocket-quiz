<?php

namespace App\Http\Controllers;

use App\Events\QuizEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index()
    {
        return Inertia::render('Quiz');
    }

//     public function startQuiz()
//     {
//         $question = "What is the capital of France?";
//         $options = ["London", "Berlin", "Paris", "Madrid"];
        
//         event(new QuizEvent($question, $options));
        
//         return response()->json(['message' => 'Quiz started']);
//     }
public function startQuiz()
{
    $question = "What is the capital of France?";
    $options = ["London", "Berlin", "Paris", "Madrid"];
    
    broadcast(new QuizEvent($question, $options))->toOthers();
    
    return response()->json([
        'message' => 'Quiz started',
        'question' => $question,
        'options' => $options
    ]);
}
}
