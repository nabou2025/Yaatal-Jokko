<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * YAATAL JOKKO — Table des quiz
 * Chaque quiz est rattaché à un thème et contient des questions.
 */
return new class extends Migration
{
    public function up(): void
    {
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->string('titre');
            $table->text('description')->nullable();
            $table->foreignId('theme_id')
                  ->constrained('themes')
                  ->onDelete('cascade');
            $table->unsignedTinyInteger('note_passage')->default(60); // % requis pour valider
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
