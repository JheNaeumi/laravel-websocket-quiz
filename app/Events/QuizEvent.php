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
    public $options;

    public function __construct($question, $options)
    {
        $this->question = $question;
        $this->options = $options;
    }

    public function broadcastOn()
    {
        return new Channel('quiz');
    }
    public function broadcastAs()
    {
        return 'QuizEvent';
    }
}