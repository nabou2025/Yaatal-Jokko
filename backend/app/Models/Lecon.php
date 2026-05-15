<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Lecon extends Model
{
    protected $fillable = [
        'titre',
        'description',
        'video',
        'image',
        'theme_id',
        'ordre',
    ];

    public function theme()
    {
        return $this->belongsTo(Theme::class);
    }
}
