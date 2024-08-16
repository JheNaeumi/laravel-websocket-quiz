<?php
// app/Events/UserJoinedQuiz.php

namespace App\Events;

use App\Models\Quiz;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UserJoinedQuiz implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $quiz;
    public $participantName;

    public function __construct(Quiz $quiz, $participantName)
    {
        $this->quiz = $quiz;
        $this->participantName = $participantName;
    }

    public function broadcastOn() :array
    {
       return [
           new Channel("quizzes.{$this->quiz->id}"),
       ];
    }
}
