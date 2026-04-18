<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| YAATAL JOKKO — Routes API
|--------------------------------------------------------------------------
*/

Route::post('/register', [AuthController::class, 'register']);