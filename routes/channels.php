<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('quiz.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
