'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import BottomNav from '../../components/BottomNav';
import { Puzzle } from 'lucide-react';

interface Theme {
  id: number;
  nom: string;
  description?: string;
  niveau_id: number;
  niveau?: { id: number; nom: string };
}

interface Quiz {
  id: number;
  titre: string;
  description?: string;
  theme_id: number;
  theme?: Theme;
  questions_count?: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function QuizListContent() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }
    fetchQuizzes();
  }, [router]);

  const fetchQuizzes = async () => {
    try {
      const res = await fetch(`${API_URL}/api/quiz`, { headers: { Accept: 'application/json' } });
      if (!res.ok) {
        setQuizzes([]);
        return;
      }
      const data = await res.json();
      setQuizzes(data.quiz || data.quizzes || []);
    } catch (err) {
      console.error('Erreur chargement quiz :', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4' }}>
        <p style={{ color: '#2D3561' }}>Chargement des quiz...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24" style={{ backgroundColor: '#F9E8E4' }}>
      {/* Header */}
      <div className="px-6 pt-10 pb-4">
        <button
          onClick={() => router.push('/dashboard')}
          className="flex items-center gap-2 mb-4 text-sm font-medium"
          style={{ color: '#2D3561' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
        <h1 className="text-3xl font-bold" style={{ color: '#2D3561', fontFamily: "'Playfair Display', serif", fontStyle: 'italic', display: 'flex', alignItems: 'center', gap: 10 }}>
          <Puzzle size={28} color="#2D3561" /> Quiz
        </h1>
        <p className="text-sm mt-1" style={{ color: '#E8A898' }}>
          Testez vos connaissances et validez votre apprentissage
        </p>
      </div>

      {/* Liste */}
      <div className="px-6 space-y-3">
        {quizzes.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
            <div className="mb-3 flex justify-center"><Puzzle size={48} color="#9CA3AF" /></div>
            <p className="text-sm font-medium" style={{ color: '#2D3561' }}>Aucun quiz disponible pour l&apos;instant.</p>
            <p className="text-xs mt-1" style={{ color: '#E8A898' }}>Revenez bientôt !</p>
          </div>
        ) : (
          quizzes.map(quiz => (
            <button
              key={quiz.id}
              onClick={() => router.push(`/quiz/${quiz.id}`)}
              className="w-full bg-white rounded-2xl p-4 shadow-sm flex items-center gap-4 text-left"
            >
              <div
                className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: '#2D3561' }}
              >
                <Puzzle size={24} color="white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm truncate" style={{ color: '#2D3561' }}>{quiz.titre}</p>
                {quiz.description && (
                  <p className="text-xs text-gray-400 mt-0.5 line-clamp-2">{quiz.description}</p>
                )}
                <div className="flex items-center gap-2 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: '#E8A898' }}></div>
                  <p className="text-xs" style={{ color: '#E8A898' }}>
                    {quiz.questions_count || 0} question{(quiz.questions_count || 0) > 1 ? 's' : ''}
                    {quiz.theme?.nom ? ` · ${quiz.theme.nom}` : ''}
                  </p>
                </div>
              </div>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2D3561" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            </button>
          ))
        )}
      </div>

      <BottomNav active="quiz" />
    </div>
  );
}

export default function QuizPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: '#F9E8E4', color: '#2D3561' }}>Chargement...</div>}>
      <QuizListContent />
    </Suspense>
  );
}
