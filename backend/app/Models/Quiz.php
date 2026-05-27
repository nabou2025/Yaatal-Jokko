<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Quiz extends Model
{
    /**
     * YAATAL JOKKO — Modèle Quiz
     * Un quiz est lié à un thème et contient plusieurs questions.
     */
    protected $table = 'quizzes';

    protected $fillable = [
        'titre',
        'description',
        'theme_id',
        'note_passage',
        'ordre',
    ];

    protected $casts = [
        'note_passage' => 'integer',
        'ordre'        => 'integer',
    ];

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }

    public function questions()
    {
        return $this->hasMany(Question::class)->orderBy('ordre');
    }
}
