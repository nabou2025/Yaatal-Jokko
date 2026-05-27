<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Question extends Model
{
    /**
     * YAATAL JOKKO — Modèle Question
     * Une question appartient à un quiz et propose plusieurs réponses.
     */
    protected $fillable = [
        'enonce',
        'quiz_id',
        'ordre',
    ];

    protected $casts = [
        'ordre' => 'integer',
    ];

    public function quiz()
    {
        return $this->belongsTo(Quiz::class);
    }

    public function reponses()
    {
        return $this->hasMany(Reponse::class);
    }

    /**
     * Réponse correcte associée (utile pour la correction côté serveur).
     */
    public function bonneReponse()
    {
        return $this->hasOne(Reponse::class)->where('est_correcte', true);
    }
}
