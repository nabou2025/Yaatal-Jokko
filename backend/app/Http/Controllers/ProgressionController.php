<?php

namespace App\Http\Controllers;

use App\Models\Progression;
use Illuminate\Http\Request;

class ProgressionController extends Controller
{
    public function show(Request $request, $userId)
    {
        if (!$request->user()->isAdmin() && $request->user()->id != $userId) {
            return response()->json([
                'app'     => 'Yaatal Jokko',
                'message' => 'Acces refuse.',
            ], 403);
        }

        $progressions = Progression::with(['quiz.theme'])
                                   ->where('user_id', $userId)
                                   ->orderBy('created_at', 'desc')
                                   ->get();

        $totalQuiz   = $progressions->count();
        $quizReussis = $progressions->where('reussi', true)->count();
        $moyenne     = $totalQuiz > 0 ? round($progressions->avg('pourcentage')) : 0;

        return response()->json([
            'app'          => 'Yaatal Jokko',
            'progressions' => $progressions,
            'stats'        => [
                'total_quiz'   => $totalQuiz,
                'quiz_reussis' => $quizReussis,
                'moyenne'      => $moyenne,
            ],
        ]);
    }
}
