<?php

namespace App\Http\Controllers;

use App\Events\QuizEvent;
use App\Models\Lobby;
use App\Models\Question;
use App\Models\Answer;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuizController extends Controller
{
    public function index(Lobby $lobby)
    {
        $user = auth()->user();
        $isHost = $lobby->host_id === $user->id;
        $questionCount = Question::where('user_id', $lobby->host_id)->count();

        return Inertia::render('Quiz/Index', [
            'lobby' => $lobby->load('host', 'participants'),
            'isHost' => $isHost,
            'questionCount' => $questionCount
        ]);
    }

    public function startQuiz(Request $request, Lobby $lobby)
    {
        if ($lobby->host_id !== auth()->id()) {
            return response()->json(['error' => 'Only the host can start the quiz'], 403);
        }

        $questions = Question::where('user_id', $lobby->host_id)->inRandomOrder()->get();

        if ($questions->isEmpty()) {
            return response()->json(['error' => 'No questions available'], 404);
        }

        $lobby->current_question_index = 0;
        $lobby->save();

        $this->broadcastQuestion($lobby, $questions[0]);

        return response()->json(['message' => 'Quiz started']);
    }

    public function nextQuestion(Request $request, Lobby $lobby)
    {
        if ($lobby->host_id !== auth()->id()) {
            return response()->json(['error' => 'Only the host can progress the quiz'], 403);
        }

        $questions = Question::where('user_id', $lobby->host_id)->get();

        $lobby->current_question_index += 1;
        if ($lobby->current_question_index >= $questions->count()) {
            $lobby->current_question_index = null;
            $lobby->save();
            $this->broadcastQuizEnd($lobby);
            return response()->json(['message' => 'Quiz ended']);
        }

        $lobby->save();

        $this->broadcastQuestion($lobby, $questions[$lobby->current_question_index]);

        return response()->json(['message' => 'Next question broadcasted']);
    }

    private function broadcastQuestion(Lobby $lobby, Question $question)
    {
        $questionData = [
            'type' => 'new_question',
            'id' => $question->id,
            'question' => $question->question,
            'options' => $question->options,
        ];

        broadcast(new QuizEvent($questionData, $lobby->id));
    }

    private function broadcastQuizEnd(Lobby $lobby)
    {
        $results = $this->getQuizResults($lobby);
        broadcast(new QuizEvent(['type' => 'quiz_end', 'results' => $results], $lobby->id));
    }

    public function submitAnswer(Request $request, Lobby $lobby)
    {
        $validated = $request->validate([
            'question_id' => 'required|exists:questions,id',
            'answer' => 'required|string',
        ]);

        $user = auth()->user();
        
        // Check if the user has already answered this question
        $existingAnswer = Answer::where('user_id', $user->id)
            ->where('question_id', $validated['question_id'])
            ->first();

        if ($existingAnswer) {
            return response()->json(['error' => 'Answer already submitted'], 400);
        }

        Answer::create([
            'user_id' => $user->id,
            'question_id' => $validated['question_id'],
            'lobby_id' => $lobby->id,
            'answer' => $validated['answer'],
        ]);

        $this->broadcastAnswerStats($lobby, $validated['question_id']);

        return response()->json(['message' => 'Answer submitted']);
    }

    private function broadcastAnswerStats(Lobby $lobby, $questionId)
    {
        $stats = Answer::where('lobby_id', $lobby->id)
            ->where('question_id', $questionId)
            ->select('answer', \DB::raw('count(*) as count'))
            ->groupBy('answer')
            ->get();

        broadcast(new QuizEvent(['type' => 'answer_stats', 'stats' => $stats], $lobby->id));
    }

    private function getQuizResults(Lobby $lobby)
    {
        $questions = Question::where('user_id', $lobby->host_id)->get();
        $results = [];

        foreach ($questions as $question) {
            $answerStats = Answer::where('lobby_id', $lobby->id)
                ->where('question_id', $question->id)
                ->select('answer', \DB::raw('count(*) as count'))
                ->groupBy('answer')
                ->get();

            $results[] = [
                'question' => $question->question,
                'correct_answer' => $question->correct_answer,
                'stats' => $answerStats,
            ];
        }

        return $results;
    }
}