<?php

namespace App\Events;

use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class QuizResults implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $results;
    public $lobbyId;

    public function __construct($results, $lobbyId)
    {
        $this->results = $results;
        $this->lobbyId = $lobbyId;
    }

    public function broadcastOn():array
    {
        return[
            new Channel("quiz.{$this->lobbyId}"),
       ];
    }
}