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
}