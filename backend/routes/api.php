<?php

use Illuminate\Http\Request;
use Illuminate\Support\Routing\RouteFileRegistrar;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;

/*
|--------------------------------------------------------------------------
| YAATAL JOKKO — Routes API
|--------------------------------------------------------------------------
|
| Toutes les routes publiques (sans authentification) sont définies ici.
| Les routes protégées utilisent le middleware 'auth:sanctum'.
|
*/

// ✅ Routes publiques — Authentification
Route::prefix('auth')->group(function () {

    // POST /api/auth/register — Inscription d'un nouvel apprenant
    Route::post('/register', [AuthController::class, 'register']);

    // POST /api/auth/login — Connexion d'un utilisateur existant
    Route::post('/login', [AuthController::class, 'login']);

});

// ✅ Routes protégées — nécessitent un token Sanctum valide
Route::middleware('auth:sanctum')->group(function () {

    // GET /api/user — Récupérer les infos de l'utilisateur connecté
    Route::get('/user', function (Request $request) {
        return response()->json([
            'app'  => 'Yaatal Jokko',
            'user' => $request->user(),
        ]);
    });

    // POST /api/auth/logout — Déconnexion (révocation du token)
    Route::post('/auth/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Déconnexion réussie.',
        ]);
    });

});
