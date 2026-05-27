<?php

namespace App\Http\Controllers;

use App\Models\Quiz;
use App\Models\Question;
use App\Models\Reponse;
use App\Models\Progression;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/**
 * YAATAL JOKKO — Contrôleur Quiz
 * Gère le CRUD des quiz, des questions, des réponses
 * ainsi que la correction automatique côté serveur.
 */
class QuizController extends Controller
{
    /**
     * GET /api/quiz
     * Liste tous les quiz (publique).
     */
    public function index()
    {
        $quiz = Quiz::with('theme')
                    ->withCount('questions')
                    ->orderBy('ordre')
                    ->get();

        return response()->json([
            'app'  => 'Yaatal Jokko',
            'quiz' => $quiz,
        ]);
    }

    /**
     * GET /api/quiz/theme/{theme_id}
     * Liste les quiz d'un thème.
     */
    public function byTheme($theme_id)
    {
        $quiz = Quiz::with('theme')
                    ->withCount('questions')
                    ->where('theme_id', $theme_id)
                    ->orderBy('ordre')
                    ->get();

        return response()->json([
            'app'  => 'Yaatal Jokko',
            'quiz' => $quiz,
        ]);
    }

    /**
     * GET /api/quiz/{id}
     * Détail d'un quiz avec ses questions et réponses (sans révéler les bonnes réponses).
     */
    public function show($id)
    {
        $quiz = Quiz::with(['theme', 'questions.reponses'])
                    ->findOrFail($id);

        // On masque le champ est_correcte côté joueur
        $quiz->questions->each(function ($q) {
            $q->reponses->each(function ($r) {
                $r->makeHidden('est_correcte');
            });
        });

        return response()->json([
            'app'  => 'Yaatal Jokko',
            'quiz' => $quiz,
        ]);
    }

    /**
     * POST /api/quiz
     * Créer un quiz (admin).
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre'        => 'required|string|max:255',
            'description'  => 'nullable|string',
            'theme_id'     => 'required|exists:themes,id',
            'note_passage' => 'nullable|integer|min:0|max:100',
            'ordre'        => 'nullable|integer',
        ], [
            'titre.required'    => 'Yaatal Jokko : le titre du quiz est obligatoire.',
            'theme_id.required' => 'Yaatal Jokko : le thème est obligatoire.',
            'theme_id.exists'   => 'Yaatal Jokko : ce thème n\'existe pas.',
        ]);

        $quiz = Quiz::create([
            'titre'        => $request->titre,
            'description'  => $request->description,
            'theme_id'     => $request->theme_id,
            'note_passage' => $request->note_passage ?? 60,
            'ordre'        => $request->ordre ?? 1,
        ]);

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Quiz créé avec succès.',
            'quiz'    => $quiz->load('theme'),
        ], 201);
    }

    /**
     * PUT /api/quiz/{quiz}
     * Mettre à jour un quiz (admin).
     */
    public function update(Request $request, Quiz $quiz)
    {
        $request->validate([
            'titre'        => 'sometimes|string|max:255',
            'description'  => 'nullable|string',
            'theme_id'     => 'sometimes|exists:themes,id',
            'note_passage' => 'nullable|integer|min:0|max:100',
            'ordre'        => 'nullable|integer',
        ]);

        $quiz->update($request->only('titre', 'description', 'theme_id', 'note_passage', 'ordre'));

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Quiz mis à jour avec succès.',
            'quiz'    => $quiz->load('theme'),
        ]);
    }

    /**
     * DELETE /api/quiz/{quiz}
     * Supprimer un quiz (admin).
     */
    public function destroy(Quiz $quiz)
    {
        $quiz->delete();
        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Quiz supprimé avec succès.',
        ]);
    }

    /**
     * POST /api/quiz/{id}/corriger
     * Correction automatique côté serveur.
     * Payload : { "reponses": [ { "question_id": int, "reponse_id": int|null }, ... ] }
     */
    public function corriger(Request $request, $id)
    {
        $quiz = Quiz::with('questions.reponses')->findOrFail($id);

        $request->validate([
            'reponses'                => 'required|array',
            'reponses.*.question_id'  => 'required|integer|exists:questions,id',
            'reponses.*.reponse_id'   => 'nullable|integer|exists:reponses,id',
        ]);

        $details = [];
        $score   = 0;
        $total   = $quiz->questions->count();

        foreach ($quiz->questions as $question) {
            $bonneReponse = $question->reponses->firstWhere('est_correcte', true);
            $bonneReponseId = $bonneReponse?->id;

            $userAnswer = collect($request->reponses)
                ->firstWhere('question_id', $question->id);
            $userReponseId = $userAnswer['reponse_id'] ?? null;

            $isCorrect = $userReponseId !== null && $userReponseId === $bonneReponseId;
            if ($isCorrect) {
                $score++;
            }

            $details[] = [
                'question_id'     => $question->id,
                'correct'         => $isCorrect,
                'bonne_reponse_id' => $bonneReponseId,
            ];
        }

        $pourcentage = $total > 0 ? (int) round(($score / $total) * 100) : 0;
        $reussi      = $pourcentage >= $quiz->note_passage;

        // Enregistrer la progression si l'utilisateur est authentifié et a réussi
        if ($request->user() && $reussi) {
            Progression::updateOrCreate(
                [
                    'user_id'   => $request->user()->id,
                    'quiz_id'   => $quiz->id,
                ],
                [
                    'pourcentage'  => $pourcentage,
                    'reussi'       => true,
                    'completed_at' => now(),
                ]
            );
        }

        return response()->json([
            'app'       => 'Yaatal Jokko',
            'resultat'  => [
                'score'        => $score,
                'total'        => $total,
                'pourcentage'  => $pourcentage,
                'reussi'       => $reussi,
                'note_passage' => $quiz->note_passage,
                'details'      => $details,
            ],
        ]);
    }
}
