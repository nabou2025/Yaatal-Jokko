<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\NiveauController;

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

// ✅ Routes publiques — Niveaux (lecture seule)
Route::get('/niveaux', [NiveauController::class, 'index']);

// ✅ Routes protégées — nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {

    // Profil
    Route::get('/user',          [AuthController::class, 'profile']);
    Route::put('/auth/profile',  [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout',  [AuthController::class, 'logout']);

    // Niveaux — admin uniquement
    Route::post('/niveaux',           [NiveauController::class, 'store']);
    Route::put('/niveaux/{niveau}',   [NiveauController::class, 'update']);
    Route::delete('/niveaux/{niveau}',[NiveauController::class, 'destroy']);

});
