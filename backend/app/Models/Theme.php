<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Theme extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'image',
        'niveau_id',
        'ordre',
    ];

    public function niveau()
    {
        return $this->belongsTo(Niveau::class);
    }

    public function lecons()
    {
        return $this->hasMany(Lecon::class);
    }

    public function quiz()
    {
        // Compatibilité : un thème peut avoir un quiz principal
        return $this->hasOne(Quiz::class);
    }

    public function quizzes()
    {
        // YAATAL JOKKO : un thème peut désormais avoir plusieurs quiz
        return $this->hasMany(Quiz::class);
    }
}
