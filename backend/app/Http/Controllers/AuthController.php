<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * YAATAL JOKKO — Inscription d'un nouvel apprenant
     * POST /api/register
     */
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string|max:255',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|string|min:8|confirmed',
        ], [
            'name.required'      => 'Yaatal Jokko : le prénom est obligatoire.',
            'email.required'     => 'Yaatal Jokko : l\'email est obligatoire.',
            'email.unique'       => 'Yaatal Jokko : cet email est déjà utilisé.',
            'password.required'  => 'Yaatal Jokko : le mot de passe est obligatoire.',
            'password.min'       => 'Yaatal Jokko : le mot de passe doit contenir au moins 8 caractères.',
            'password.confirmed' => 'Yaatal Jokko : les mots de passe ne correspondent pas.',
        ]);

        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'role'     => 'apprenant',
        ]);

        $token = $user->createToken('yaatal-jokko-token')->plainTextToken;

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Bienvenue sur Yaatal Jokko ! Votre compte apprenant a été créé.',
            'user'    => $user,
            'token'   => $token,
        ], 201);
    }

    /**
     * YAATAL JOKKO — Connexion d'un utilisateur existant
     * POST /api/login
     */
    public function login(Request $request)
    {
        // ✅ Étape 1 : Validation des champs envoyés
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required'    => 'Yaatal Jokko : l\'email est obligatoire.',
            'email.email'       => 'Yaatal Jokko : l\'email n\'est pas valide.',
            'password.required' => 'Yaatal Jokko : le mot de passe est obligatoire.',
        ]);

        // ✅ Étape 2 : Vérifier si l'email existe en base de données
        $user = User::where('email', $request->email)->first();

        // ✅ Étape 3 : Vérifier le mot de passe + gérer l'erreur mauvais identifiants
        if (! $user || ! Hash::check($request->password, $user->password)) {
            return response()->json([
                'app'     => 'Yaatal Jokko',
                'message' => 'Yaatal Jokko : identifiants incorrects. Vérifiez votre email et mot de passe.',
                'errors'  => [
                    'email' => ['Les identifiants fournis sont incorrects.'],
                ],
            ], 401);
        }

        // ✅ Étape 4 : Révoquer les anciens tokens (optionnel mais recommandé)
        $user->tokens()->delete();

        // ✅ Étape 5 : Créer un nouveau token Sanctum
        $token = $user->createToken('yaatal-jokko-token')->plainTextToken;

        // ✅ Étape 6 : Retourner la réponse JSON avec token
        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Connexion réussie ! Bienvenue sur Yaatal Jokko.',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }
}
