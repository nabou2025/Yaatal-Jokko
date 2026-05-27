<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NiveauController;
use App\Http\Controllers\ThemeController;
use App\Http\Controllers\LeconController;
use App\Http\Controllers\QuizController;
use App\Http\Controllers\QuestionController;

/*
|--------------------------------------------------------------------------
| YAATAL JOKKO — Routes API
|--------------------------------------------------------------------------
*/

// ✅ Routes publiques — Authentification
Route::prefix('auth')->group(function () {
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login',    [AuthController::class, 'login']);
});

// ✅ Routes publiques — Lecture seule
Route::get('/niveaux',                   [NiveauController::class, 'index']);
Route::get('/themes',                    [ThemeController::class, 'index']);
Route::get('/themes/niveau/{niveau_id}', [ThemeController::class, 'byNiveau']);
Route::get('/lecons',                    [LeconController::class, 'index']);
Route::get('/lecons/theme/{theme_id}',   [LeconController::class, 'byTheme']);
Route::get('/quiz',                      [QuizController::class, 'index']);
Route::get('/quiz/theme/{theme_id}',     [QuizController::class, 'byTheme']);
Route::get('/quiz/{id}',                 [QuizController::class, 'show']);

// ✅ Routes protégées — nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {

    // Profil
    Route::get('/user',          [AuthController::class, 'profile']);
    Route::put('/auth/profile',  [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout',  [AuthController::class, 'logout']);

    // Correction quiz — apprenant
    Route::post('/quiz/{id}/corriger', [QuizController::class, 'corriger']);

    // ─── Routes admin uniquement ───────────────────────────
    Route::middleware('admin')->group(function () {

        // Niveaux
        Route::post('/niveaux',            [NiveauController::class, 'store']);
        Route::put('/niveaux/{niveau}',    [NiveauController::class, 'update']);
        Route::delete('/niveaux/{niveau}', [NiveauController::class, 'destroy']);

        // Thèmes
        Route::post('/themes',           [ThemeController::class, 'store']);
        Route::put('/themes/{theme}',    [ThemeController::class, 'update']);
        Route::delete('/themes/{theme}', [ThemeController::class, 'destroy']);

        // Leçons
        Route::post('/lecons',           [LeconController::class, 'store']);
        Route::put('/lecons/{lecon}',    [LeconController::class, 'update']);
        Route::delete('/lecons/{lecon}', [LeconController::class, 'destroy']);

        // Quiz
        Route::post('/quiz',           [QuizController::class, 'store']);
        Route::put('/quiz/{quiz}',     [QuizController::class, 'update']);
        Route::delete('/quiz/{quiz}',  [QuizController::class, 'destroy']);

        // Questions
        Route::post('/quiz/{quiz_id}/questions',         [QuestionController::class, 'store']);
        Route::put('/questions/{question}',              [QuestionController::class, 'update']);
        Route::delete('/questions/{question}',           [QuestionController::class, 'destroy']);

        // Réponses
        Route::post('/questions/{question_id}/reponses', [QuestionController::class, 'addReponse']);
    });
});
