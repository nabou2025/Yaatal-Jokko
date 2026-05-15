<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('lecons', function (Blueprint $table) {
            $table->id();
            $table->string('titre');                  // titre de la leçon
            $table->text('description')->nullable();  // description optionnelle
            $table->string('video')->nullable();      // chemin vers la vidéo
            $table->string('image')->nullable();      // chemin vers l'image
            $table->foreignId('theme_id')             // lié à un thème
                  ->constrained('themes')
                  ->onDelete('cascade');
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('lecons');
    }
};
