<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Quiz;
use Inertia\Inertia;
use App\Events\QuizStarted;
use App\Events\QuizChanged;
use App\Events\QuizEnded;
use App\Events\UserJoinedQuiz;
use App\Events\ParticipantAnswered;

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

    public function create()
    {
        return Inertia::render('Quizzes/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'questions' => 'required|array|min:1',
            'questions.*.question' => 'required|string',
            'questions.*.options' => 'required|array|min:2',
            'questions.*.correct_answer' => 'required|string',
            'questions.*.time_limit' => 'required|integer|min:5|max:300',
        ]);

        $quiz = Quiz::create(['title' => $validated['title'], 'user_id' => $request->id ]);

        foreach ($validated['questions'] as $questionData) {
            $quiz->questions()->create([
                'question' => $questionData['question'],
                'options' => $questionData['options'],
                'correct_answer' => $questionData['correct_answer'],
                'time_limit' => $questionData['time_limit'],
            ]);
        }

        return redirect()->route('quizzes.show', $quiz)->with('success', 'Quiz created successfully');
    }

    public function join(Quiz $quiz, Request $request)
    {
        $request->validate([
            'participant_name' => 'required|string|max:255',
        ]);

        // You might want to store this information in the database
        // For now, we'll just broadcast an event
        broadcast(new UserJoinedQuiz($quiz, $request->participant_name))->toOthers();

        return response()->json(['message' => 'Joined quiz successfully']);
    }

    public function answer(Quiz $quiz, Request $request)
    {
        $request->validate([
            'participant_name' => 'required|string',
            'answer' => 'required|string',
            'question_index' => 'required|integer|min:0',
        ]);
    
        broadcast(new ParticipantAnswered(
            $quiz,
            $request->participant_name,
            $request->answer,
            $request->question_index
        ))->toOthers();
    
        return response()->json(['message' => 'Answer submitted']);
    }
}
