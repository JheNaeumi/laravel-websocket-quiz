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
    public $questionIndex;  // Add this if you want to track which question was answered

    public function __construct(Quiz $quiz, $participantName, $answer, $questionIndex)
    {
        $this->quiz = $quiz;
        $this->participantName = $participantName;
        $this->answer = $answer;
        $this->questionIndex = $questionIndex;
    }

    public function broadcastOn(): array
    {
        return [
            new Channel("quizzes.{$this->quiz->id}"),
        ];
    }

    // public function broadcastAs(): string
    // {
    //     return 'participant.answered';
    // }

    public function broadcastWith(): array
    {
        return [
            'quiz_id' => $this->quiz->id,
            'participant_name' => $this->participantName,
            'answer' => $this->answer,
            'question_index' => $this->questionIndex,
        ];
    }
}
