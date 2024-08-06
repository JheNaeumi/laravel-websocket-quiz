<?php

use App\Http\Controllers\LobbyController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::resource('lobbies', LobbyController::class);
    Route::post('/lobbies/{lobby}/ready', [LobbyController::class, 'setReady'])->name('lobbies.ready');

    Route::resource('questions', QuestionController::class);
    Route::post('/lobbies/{lobby}/quiz/start', [QuizController::class, 'startQuiz'])->name('quiz.start');
    Route::post('/lobbies/{lobby}/quiz/next', [QuizController::class, 'nextQuestion'])->name('quiz.next');
    Route::post('/lobbies/{lobby}/quiz/submit-answer', [QuizController::class, 'submitAnswer'])->name('quiz.answer');
    Route::get('/quiz/{lobby}', [QuizController::class, 'index'])->name('quiz.index');
    
});

require __DIR__.'/auth.php';
