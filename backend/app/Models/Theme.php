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
        return $this->hasOne(Quiz::class);
    }
}
