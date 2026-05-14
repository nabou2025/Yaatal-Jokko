<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

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

// ✅ Routes protégées — nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {

    // Profil
    Route::get('/user',           [AuthController::class, 'profile']);
    Route::put('/auth/profile',   [AuthController::class, 'updateProfile']);
    Route::post('/auth/logout',   [AuthController::class, 'logout']);

});

