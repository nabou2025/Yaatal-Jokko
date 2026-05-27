<?php

namespace App\Http\Controllers;

use App\Models\Question;
use App\Models\Reponse;
use Illuminate\Http\Request;

class QuestionController extends Controller
{
    /**
     * YAATAL JOKKO — Ajouter une question à un quiz
     * POST /api/quiz/{quiz_id}/questions
     */
    public function store(Request $request, $quiz_id)
    {
        $request->validate([
            'enonce' => 'required|string',
            'ordre'  => 'nullable|integer',
        ], [
            'enonce.required' => 'Yaatal Jokko : l\'énoncé est obligatoire.',
        ]);

        $question = Question::create([
            'enonce'  => $request->enonce,
            'quiz_id' => $quiz_id,
            'ordre'   => $request->ordre ?? 1,
        ]);

        return response()->json([
            'app'      => 'Yaatal Jokko',
            'message'  => 'Question ajoutée avec succès.',
            'question' => $question,
        ], 201);
    }

    /**
     * YAATAL JOKKO — Modifier une question
     * PUT /api/questions/{id}
     */
    public function update(Request $request, Question $question)
    {
        $question->update($request->only('enonce', 'ordre'));

        return response()->json([
            'app'      => 'Yaatal Jokko',
            'message'  => 'Question modifiée avec succès.',
            'question' => $question,
        ]);
    }

    /**
     * YAATAL JOKKO — Supprimer une question
     * DELETE /api/questions/{id}
     */
    public function destroy(Question $question)
    {
        $question->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Question supprimée avec succès.',
        ]);
    }

    /**
     * YAATAL JOKKO — Ajouter une réponse à une question
     * POST /api/questions/{question_id}/reponses
     */
    public function addReponse(Request $request, $question_id)
    {
        $request->validate([
            'texte'        => 'required|string',
            'est_correcte' => 'required|boolean',
        ], [
            'texte.required' => 'Yaatal Jokko : le texte de la réponse est obligatoire.',
        ]);

        $reponse = Reponse::create([
            'texte'        => $request->texte,
            'question_id'  => $question_id,
            'est_correcte' => $request->est_correcte,
        ]);

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Réponse ajoutée avec succès.',
            'reponse' => $reponse,
        ], 201);
    }
}
