<?php

namespace App\Models;

use Laravel\Sanctum\HasApiTokens;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasApiTokens, Notifiable;

    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
    ];

    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Relation avec les leçons complétées (Table pivot user_lecon)
     */
    public function lecons()
    {
        return $this->belongsToMany(Lecon::class, 'user_lecon')
                    ->withPivot('termine')
                    ->withTimestamps();
    }

    /**
     * Relation avec les quiz complétés (Table pivot user_quiz)
     */
    public function quizzes()
    {
        return $this->belongsToMany(Quiz::class, 'user_quiz')
                    ->withPivot('termine')
                    ->withTimestamps();
    }
}