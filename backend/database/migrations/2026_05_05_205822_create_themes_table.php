<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('themes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');                    // alphabet, famille, nourriture...
            $table->text('description')->nullable();
            $table->string('image')->nullable();      // image du thème
            $table->foreignId('niveau_id')            // lié à un niveau
                  ->constrained('niveaux')
                  ->onDelete('cascade');
            $table->integer('ordre')->default(1);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('themes');
    }
};
