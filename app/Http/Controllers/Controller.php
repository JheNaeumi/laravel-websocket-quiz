<?php

namespace App\Http\Controllers;

abstract class Controller
{
    //
    protected $middlewareGroups = [
        'web' => [
            // ...
            \App\Http\Middleware\HandleInertiaRequests::class,
        ],
    ];
}

