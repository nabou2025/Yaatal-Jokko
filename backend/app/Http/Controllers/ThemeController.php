<?php

namespace App\Http\Controllers;

use App\Models\Theme;
use Illuminate\Http\Request;

class ThemeController extends Controller
{
    public function index()
    {
        $themes = Theme::with('niveau')->orderBy('ordre')->get();
        return response()->json([
            'app'    => 'Yaatal Jokko',
            'themes' => $themes,
        ]);
    }

    public function byNiveau($niveau_id)
    {
        $themes = Theme::with('niveau')
                       ->where('niveau_id', $niveau_id)
                       ->orderBy('ordre')
                       ->get();
        return response()->json([
            'app'    => 'Yaatal Jokko',
            'themes' => $themes,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nom'         => 'required|string|max:255',
            'niveau_id'   => 'required|exists:niveaux,id',
            'description' => 'nullable|string',
            'ordre'       => 'nullable|integer',
        ], [
            'nom.required'       => 'Yaatal Jokko : le nom du theme est obligatoire.',
            'niveau_id.required' => 'Yaatal Jokko : le niveau est obligatoire.',
            'niveau_id.exists'   => 'Yaatal Jokko : ce niveau nexiste pas.',
        ]);

        $theme = Theme::create([
            'nom'         => $request->nom,
            'description' => $request->description,
            'niveau_id'   => $request->niveau_id,
            'ordre'       => $request->ordre ?? 1,
        ]);

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Theme cree avec succes.',
            'theme'   => $theme->load('niveau'),
        ], 201);
    }

    public function update(Request $request, Theme $theme)
    {
        $request->validate([
            'nom'         => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'niveau_id'   => 'sometimes|exists:niveaux,id',
            'ordre'       => 'nullable|integer',
        ]);

        $theme->update($request->only('nom', 'description', 'niveau_id', 'ordre'));

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Theme modifie avec succes.',
            'theme'   => $theme->load('niveau'),
        ]);
    }

    public function destroy(Theme $theme)
    {
        $theme->delete();

        return response()->json([
            'app'     => 'Yaatal Jokko',
            'message' => 'Theme supprime avec succes.',
        ]);
    }
}
