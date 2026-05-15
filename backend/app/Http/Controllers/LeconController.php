<?php

namespace App\Http\Controllers;

use App\Models\Lecon;
use Illuminate\Http\Request;

class LeconController extends Controller
{
    /**
     * YAATAL JOKKO — Lister toutes les leçons
     * GET /api/lecons
     */
    public function index()
    {
        $lecons = Lecon::with('theme')->orderBy('ordre')->get();
        return response()->json([
            'app'    => 'Yaatal Jokko',
            'lecons' => $lecons,
        ]);
    }

    /**
     * YAATAL JOKKO — Lister les leçons par thème
     * GET /api/lecons/theme/{theme_id}
     */
    public function byTheme($theme_id)
    {
        $lecons = Lecon::with('theme')
                       ->where('theme_id', $theme_id)
                       ->orderBy('ordre')
                       ->get();
        return response()->json([
            'app'    => 'Yaatal Jokko',
            'lecons' => $lecons,
        ]);
    }

    /**
     * YAATAL JOKKO — Créer une leçon
     * POST /api/lecons
     */
    public function store(Request $request)
    {
        $request->validate([
            'titre'    => 'required|string|max:255',
            'theme_id' => 'required|exists:themes,id',
            'description' => 'nullable|string',
            'ordre'    => 'nullable|integer',
        ], [
            'titre.required'    => 'Yaatal Jokko : le titre est obligatoire.',
            'theme_id.required' => 'Yaatal Jokko : le theme est obligatoire.',
            'theme_id.exists'   => 'Yaatal Jokko : ce theme nexiste pas.',
        ]);

        $data = [
            'titre'       => $request->titre,
            'description' => $request->description,
            'theme_id'    => $request->theme_id,
            'ordre'       => $request->ordre ?? 1,
        ];

        // Gestion upload vidéo
        if ($request->hasFile('video')) {
            $data['video'] = $request->file('video')->store('lecons/videos', 'public');
        }

        // Gestion upload image
        if ($request->hasFile('image')) {
            $data['image'] = $request->file('image')->store('lecons/images', 'public');
        }

        $lecon = Lecon::create($data);

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Lecon creee avec succes.',
            'lecon'   => $lecon->load('theme'),
        ], 201);
    }

    /**
     * YAATAL JOKKO — Modifier une leçon
     * PUT /api/lecons/{id}
     */
    public function update(Request $request, Lecon $lecon)
    {
        $request->validate([
            'titre'       => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'theme_id'    => 'sometimes|exists:themes,id',
            'ordre'       => 'nullable|integer',
        ]);

        $lecon->update($request->only('titre', 'description', 'theme_id', 'ordre'));

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Lecon modifiee avec succes.',
            'lecon'   => $lecon->load('theme'),
        ]);
    }

    /**
     * YAATAL JOKKO — Supprimer une leçon
     * DELETE /api/lecons/{id}
     */
    public function destroy(Lecon $lecon)
    {
        $lecon->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Lecon supprimee avec succes.',
        ]);
    }
}
