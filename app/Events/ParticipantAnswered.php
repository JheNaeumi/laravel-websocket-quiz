<?php

// app/Events/ParticipantAnswered.php

namespace App\Events;

use App\Models\Quiz;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ParticipantAnswered implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $quiz;
    public $participantName;
    public $answer;

    public function __construct(Quiz $quiz, $participantName, $answer)
    {
        $this->quiz = $quiz;
        $this->participantName = $participantName;
        $this->answer = $answer;
    }

    public function broadcastOn() : array
    {
        return [new Channel("quizzes.{$this->quiz->id}"),];
    }
}
