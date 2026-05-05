<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Niveau extends Model
{
    protected $fillable = [
        'nom',
        'description',
        'ordre',
    ];

    public function themes()
    {
        return $this->hasMany(Theme::class);
    }
}
