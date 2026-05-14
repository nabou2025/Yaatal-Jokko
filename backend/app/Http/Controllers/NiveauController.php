<?php

namespace App\Http\Controllers;

use App\Models\Niveau;
use Illuminate\Http\Request;

class NiveauController extends Controller
{
    /**
     * YAATAL JOKKO — Lister tous les niveaux
     * GET /api/niveaux
     */
    public function index()
    {
        $niveaux = Niveau::orderBy('ordre')->get();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'niveaux' => $niveaux,
        ]);
    }

    /**
     * YAATAL JOKKO — Créer un niveau
     * POST /api/niveaux
     */
    public function store(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'description' => 'nullable|string',
            'ordre'       => 'nullable|integer',
        ], [
            'nom.required' => 'Yaatal Jokko : le nom du niveau est obligatoire.',
        ]);

        $niveau = Niveau::create([
            'nom'         => $request->nom,
            'description' => $request->description,
            'ordre'       => $request->ordre ?? 1,
        ]);

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Niveau créé avec succès.',
            'niveau'  => $niveau,
        ], 201);
    }

    /**
     * YAATAL JOKKO — Modifier un niveau
     * PUT /api/niveaux/{id}
     */
    public function update(Request $request, Niveau $niveau)
    {
        $request->validate([
            'nom'         => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'ordre'       => 'nullable|integer',
        ]);

        $niveau->update($request->only('nom', 'description', 'ordre'));

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Niveau modifié avec succès.',
            'niveau'  => $niveau,
        ]);
    }

    /**
     * YAATAL JOKKO — Supprimer un niveau
     * DELETE /api/niveaux/{id}
     */
    public function destroy(Niveau $niveau)
    {
        $niveau->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Niveau supprimé avec succès.',
        ]);
    }
}
