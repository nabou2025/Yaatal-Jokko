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
     * POST /api/auth/register
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
     * YAATAL JOKKO — Connexion
     * POST /api/auth/login
     */
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required|string',
        ], [
            'email.required'    => 'Yaatal Jokko : l\'email est obligatoire.',
            'email.email'       => 'Yaatal Jokko : l\'email n\'est pas valide.',
            'password.required' => 'Yaatal Jokko : le mot de passe est obligatoire.',
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages([
                'email' => ['Yaatal Jokko : identifiants incorrects.'],
            ]);
        }

        $user->tokens()->delete();

        $token = $user->createToken('yaatal-jokko-token')->plainTextToken;

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Connexion réussie ! Bienvenue sur Yaatal Jokko.',
            'user'    => $user,
            'token'   => $token,
        ], 200);
    }

    /**
     * YAATAL JOKKO — Déconnexion
     * POST /api/auth/logout
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Déconnexion réussie. À bientôt sur Yaatal Jokko !',
        ]);
    }

    /**
     * YAATAL JOKKO — Afficher le profil
     * GET /api/user
     */
    public function profile(Request $request)
    {
        return response()->json([
            'app'  => 'Yaatal Jokko',
            'user' => $request->user(),
        ]);
    }

    /**
     * YAATAL JOKKO — Modifier le profil
     * PUT /api/auth/profile
     */
    public function updateProfile(Request $request)
    {
        $request->validate([
            'name'  => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $request->user()->id,
        ], [
            'email.unique' => 'Yaatal Jokko : cet email est déjà utilisé.',
        ]);

        $request->user()->update($request->only('name', 'email'));

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Profil mis à jour avec succès.',
            'user'    => $request->user(),
        ]);
    }
}
