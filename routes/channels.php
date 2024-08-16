<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('quizzes.{id}', function ($user, $id) {
    return (int) $user->id === (int) $id;
});
