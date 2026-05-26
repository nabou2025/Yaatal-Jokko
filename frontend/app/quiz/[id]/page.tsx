'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import BottomNav from '../../../components/BottomNav';
import { Search, Trophy, Dumbbell, Check, X as XIcon, Loader2, RefreshCw } from 'lucide-react';

interface Reponse {
  id: number;
  question_id: number;
  texte: string;
  // est_correcte n'est PAS exposé en mode joueur — le backend filtre
}

interface Question {
  id: number;
  enonce: string;
  ordre: number;
  reponses: Reponse[];
}

interface Quiz {
  id: number;
  titre: string;
  description?: string;
  theme_id: number;
  questions: Question[];
}

interface CorrectionResult {
  score: number;
  total: number;
  pourcentage: number;
  reussi: boolean;
  details: { question_id: number; correct: boolean; bonne_reponse_id?: number }[];
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

export default function QuizDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<CorrectionResult | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchQuiz();
  }, [router, id]);

  const fetchQuiz = async () => {
    try {
      const res = await fetch(`${API_URL}/api/quiz/${id}`, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        setQuiz(null);
        return;
      }
      const data = await res.json();
      setQuiz(data.quiz || null);
    } catch (err) {
      console.error('Erreur chargement quiz :', err);
    } finally {
      setLoading(false);
    }
  };

  const selectAnswer = (questionId: number, reponseId: number) => {
    if (result) return; // verrouillé après soumission
    setAnswers(prev => ({ ...prev, [questionId]: reponseId }));
  };

  const submit = async () => {
    if (!quiz) return;
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        reponses: quiz.questions.map(q => ({
          question_id: q.id,
          reponse_id: answers[q.id] ?? null,
        })),
      };
      const res = await fetch(`${API_URL}/api/quiz/${id}/corriger`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (res.ok) setResult(data.resultat || data);
    } catch (err) {
      console.error('Erreur correction :', err);
    } finally {
      setSubmitting(false);
    }
  };

  const restart = () => {
    setAnswers({});
    setResult(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4' }}>
        <p style={{ color: '#2D3561' }}>Chargement du quiz...</p>
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: '#F9E8E4' }}>
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <div className="mb-3 flex justify-center"><Search size={48} color="#9CA3AF" /></div>
          <p className="font-bold" style={{ color: '#2D3561' }}>Quiz introuvable.</p>
          <button
            onClick={() => router.push('/quiz')}
            className="mt-4 px-5 py-2 rounded-xl text-white text-sm font-medium"
            style={{ backgroundColor: '#2D3561' }}
          >
            Retour aux quiz
          </button>
        </div>
      </div>
    );
  }

  const totalAnswered = Object.keys(answers).length;
  const allAnswered = totalAnswered === quiz.questions.length;

  return (
    <div className="min-h-screen pb-28" style={{ backgroundColor: '#F9E8E4' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <button
          onClick={() => router.push('/quiz')}
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: '#2D3561' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour aux quiz
        </button>
        <h1 className="text-2xl font-bold" style={{ color: '#2D3561', fontFamily: "'Playfair Display', serif", fontStyle: 'italic' }}>
          {quiz.titre}
        </h1>
        {quiz.description && (
          <p className="text-sm mt-1" style={{ color: '#E8A898' }}>{quiz.description}</p>
        )}
      </div>

      {/* Résultat */}
      {result && (
        <div className="px-6 mb-4">
          <div className="rounded-2xl p-5 shadow-sm text-white" style={{ backgroundColor: result.reussi ? '#2D3561' : '#E8A898' }}>
            <p className="text-xs opacity-70 mb-1">Votre score</p>
            <p className="text-4xl font-bold mb-2">{result.pourcentage}%</p>
            <p className="text-sm opacity-90">
              {result.score} / {result.total} bonnes réponses
            </p>
            <p className="text-xs mt-3 opacity-80">
              {result.reussi ? (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Trophy size={14} /> Bravo, quiz validé !</span>
              ) : (
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Dumbbell size={14} /> Continuez, vous pouvez réessayer.</span>
              )}
            </p>
          </div>
        </div>
      )}

      {/* Progression */}
      {!result && (
        <div className="px-6 mb-4">
          <div className="bg-white rounded-2xl p-4 shadow-sm flex items-center justify-between">
            <p className="text-xs font-medium" style={{ color: '#2D3561' }}>
              Progression : {totalAnswered} / {quiz.questions.length}
            </p>
            <div className="flex-1 mx-3 bg-gray-100 rounded-full h-2 overflow-hidden">
              <div
                className="h-2 rounded-full transition-all"
                style={{
                  width: `${(totalAnswered / Math.max(1, quiz.questions.length)) * 100}%`,
                  backgroundColor: '#E8A898',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Questions */}
      <div className="px-6 space-y-4">
        {quiz.questions
          .sort((a, b) => a.ordre - b.ordre)
          .map((question, index) => {
            const correctReponseId = result?.details.find(d => d.question_id === question.id)?.bonne_reponse_id;
            return (
              <div key={question.id} className="bg-white rounded-2xl p-5 shadow-sm">
                <p className="text-xs font-bold mb-2" style={{ color: '#E8A898' }}>
                  Question {index + 1} / {quiz.questions.length}
                </p>
                <p className="text-sm font-bold mb-4" style={{ color: '#2D3561' }}>
                  {question.enonce}
                </p>
                <div className="space-y-2">
                  {question.reponses.map(rep => {
                    const isSelected = answers[question.id] === rep.id;
                    const isCorrect = result && correctReponseId === rep.id;
                    const isWrongSelected = result && isSelected && correctReponseId !== rep.id;

                    let bg = '#F9E8E4';
                    let border = '1.5px solid transparent';
                    let color = '#2D3561';
                    if (isSelected && !result) {
                      bg = '#2D3561';
                      color = '#FFFFFF';
                    }
                    if (isCorrect) {
                      bg = '#2D3561';
                      color = '#FFFFFF';
                      border = '2px solid #1f7a3a';
                    }
                    if (isWrongSelected) {
                      bg = '#fff0f0';
                      color = '#cc3333';
                      border = '2px solid #e85555';
                    }

                    return (
                      <button
                        key={rep.id}
                        onClick={() => selectAnswer(question.id, rep.id)}
                        disabled={!!result}
                        className="w-full text-left px-4 py-3 rounded-xl text-sm font-medium transition"
                        style={{ backgroundColor: bg, color, border }}
                      >
                        {isCorrect && <Check size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />}
                        {isWrongSelected && <XIcon size={14} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />}
                        {rep.texte}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
      </div>

      {/* Actions */}
      <div className="px-6 mt-6 space-y-3">
        {!result ? (
          <button
            onClick={submit}
            disabled={!allAnswered || submitting}
            className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm disabled:opacity-50"
            style={{ backgroundColor: '#2D3561' }}
          >
            {submitting ? (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Loader2 size={16} className="animate-spin" /> Correction en cours...</span>
            ) : (
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><Check size={16} /> Valider le quiz</span>
            )}
          </button>
        ) : (
          <>
            <button
              onClick={restart}
              className="w-full py-3 rounded-2xl text-white font-bold text-sm shadow-sm"
              style={{ backgroundColor: '#E8A898' }}
            >
              <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}><RefreshCw size={16} /> Recommencer</span>
            </button>
            <button
              onClick={() => router.push('/quiz')}
              className="w-full py-3 rounded-2xl font-bold text-sm shadow-sm bg-white"
              style={{ color: '#2D3561', border: '1.5px solid #E8A898' }}
            >
              Retour aux quiz
            </button>
          </>
        )}
      </div>

      <BottomNav active="quiz" />
    </div>
  );
}
