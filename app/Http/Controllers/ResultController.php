<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Result;

class ResultController extends Controller
{
    //
    public function store(Request $request)
    {
        $validated = $request->validate([
            'quiz_id' => 'required|exists:quizzes,id',
            'participant_name' => 'required|string',
            'score' => 'required|integer',
        ]);

        $result = Result::create($validated);

        return redirect()->route('quizzes.show', $result->quiz_id)->with('success', 'Result submitted successfully');
    }
}
