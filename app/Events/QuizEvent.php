<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuizEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $question;
    public $lobbyId;

    public function __construct($question, $lobbyId)
    {
        $this->question = $question;
        $this->lobbyId = $lobbyId;
    }

    public function broadcastOn():array
    {
        return[
             new Channel("quiz.{$this->lobbyId}"),
        ];
    }
    public function broadcastAs()
    {
        return 'QuizEvent';
    }

}