<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reponse extends Model
{
    /**
     * YAATAL JOKKO — Modèle Réponse
     * Une réponse est rattachée à une question. Le booléen est_correcte
     * indique si elle est la bonne réponse (jamais exposé côté joueur).
     */
    protected $table = 'reponses';

    protected $fillable = [
        'texte',
        'question_id',
        'est_correcte',
    ];

    protected $casts = [
        'est_correcte' => 'boolean',
    ];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }
}
