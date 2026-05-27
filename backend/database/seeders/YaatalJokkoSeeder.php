<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Niveau;
use App\Models\Theme;
use App\Models\Lecon;
use App\Models\Quiz;
use App\Models\Question;
use App\Models\Reponse;

class YaatalJokkoSeeder extends Seeder
{
    public function run(): void
    {
        // ─── NIVEAUX ─────────────────────────────────────────────
        $debutant = Niveau::firstOrCreate(
            ['nom' => 'Debutant'],
            ['description' => 'Pour ceux qui decouvrent la langue des signes', 'ordre' => 1]
        );

        $intermediaire = Niveau::firstOrCreate(
            ['nom' => 'Intermediaire'],
            ['description' => 'Pour ceux qui ont les bases', 'ordre' => 2]
        );

        // ─── THÈMES ───────────────────────────────────────────────
        $alphabet = Theme::firstOrCreate(
            ['nom' => 'Alphabet'],
            ['description' => 'Apprendre l alphabet de la langue des signes', 'niveau_id' => $debutant->id, 'ordre' => 1]
        );

        $famille = Theme::firstOrCreate(
            ['nom' => 'Famille'],
            ['description' => 'Les signes de la famille', 'niveau_id' => $debutant->id, 'ordre' => 2]
        );

        $nourriture = Theme::firstOrCreate(
            ['nom' => 'Nourriture'],
            ['description' => 'Les signes de la nourriture', 'niveau_id' => $intermediaire->id, 'ordre' => 1]
        );

        // ─── LEÇONS ALPHABET ──────────────────────────────────────
        $lecons_alphabet = [
            [
                'titre'       => 'La lettre A',
                'description' => 'Apprenez a signer la lettre A',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 1,
            ],
            [
                'titre'       => 'La lettre B',
                'description' => 'Apprenez a signer la lettre B',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 2,
            ],
            [
                'titre'       => 'La lettre C',
                'description' => 'Apprenez a signer la lettre C',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 3,
            ],
        ];

        foreach ($lecons_alphabet as $lecon) {
            Lecon::firstOrCreate(
                ['titre' => $lecon['titre'], 'theme_id' => $alphabet->id],
                array_merge($lecon, ['theme_id' => $alphabet->id])
            );
        }

        // ─── LEÇONS FAMILLE ───────────────────────────────────────
        $lecons_famille = [
            [
                'titre'       => 'La mere',
                'description' => 'Apprenez a signer le mot mere',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 1,
            ],
            [
                'titre'       => 'Le pere',
                'description' => 'Apprenez a signer le mot pere',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 2,
            ],
            [
                'titre'       => 'Le frere',
                'description' => 'Apprenez a signer le mot frere',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 3,
            ],
        ];

        foreach ($lecons_famille as $lecon) {
            Lecon::firstOrCreate(
                ['titre' => $lecon['titre'], 'theme_id' => $famille->id],
                array_merge($lecon, ['theme_id' => $famille->id])
            );
        }

        // ─── LEÇONS NOURRITURE ────────────────────────────────────
        $lecons_nourriture = [
            [
                'titre'       => 'Le pain',
                'description' => 'Apprenez a signer le mot pain',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 1,
            ],
            [
                'titre'       => 'L eau',
                'description' => 'Apprenez a signer le mot eau',
                'video'       => 'https://www.youtube.com/embed/tkMg8g8vVUo',
                'ordre'       => 2,
            ],
        ];

        foreach ($lecons_nourriture as $lecon) {
            Lecon::firstOrCreate(
                ['titre' => $lecon['titre'], 'theme_id' => $nourriture->id],
                array_merge($lecon, ['theme_id' => $nourriture->id])
            );
        }

        // ─── QUIZ ALPHABET ────────────────────────────────────────
        $quiz = Quiz::firstOrCreate(
            ['titre' => 'Quiz Alphabet', 'theme_id' => $alphabet->id],
            [
                'description'  => 'Testez vos connaissances sur l alphabet',
                'note_passage' => 60,
                'ordre'        => 1,
            ]
        );

        // ─── QUESTIONS & RÉPONSES ─────────────────────────────────
        $questions = [
            [
                'enonce'   => 'Quel signe represente la lettre A ?',
                'ordre'    => 1,
                'reponses' => [
                    ['texte' => 'Le poing ferme', 'est_correcte' => true],
                    ['texte' => 'La main ouverte', 'est_correcte' => false],
                    ['texte' => 'Deux doigts leves', 'est_correcte' => false],
                ],
            ],
            [
                'enonce'   => 'Quel signe represente la lettre B ?',
                'ordre'    => 2,
                'reponses' => [
                    ['texte' => 'Les quatre doigts tendus vers le haut', 'est_correcte' => true],
                    ['texte' => 'Le poing ferme', 'est_correcte' => false],
                    ['texte' => 'Le pouce leve', 'est_correcte' => false],
                ],
            ],
            [
                'enonce'   => 'Quel signe represente la lettre C ?',
                'ordre'    => 3,
                'reponses' => [
                    ['texte' => 'La main en forme de C', 'est_correcte' => true],
                    ['texte' => 'Le poing ferme', 'est_correcte' => false],
                    ['texte' => 'La main ouverte', 'est_correcte' => false],
                ],
            ],
        ];

        foreach ($questions as $q) {
            $question = Question::firstOrCreate(
                ['enonce' => $q['enonce'], 'quiz_id' => $quiz->id],
                ['ordre' => $q['ordre'], 'quiz_id' => $quiz->id]
            );

            foreach ($q['reponses'] as $r) {
                Reponse::firstOrCreate(
                    ['texte' => $r['texte'], 'question_id' => $question->id],
                    ['est_correcte' => $r['est_correcte'], 'question_id' => $question->id]
                );
            }
        }

        $this->command->info('✅ Yaatal Jokko — Données de démonstration insérées avec succès !');
    }
}
