'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { api, auth, Exercise } from '../../../lib/api';
import { Trophy, ThumbsUp, Dumbbell, Check, X as XIcon, RefreshCw, Puzzle } from 'lucide-react';

export default function ExercisePage() {
  const { id } = useParams();
  const router = useRouter();
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    api.get<Exercise>(`/exercises/${id}`)
      .then(setExercise)
      .finally(() => setLoading(false));
  }, [id, router]);

  if (loading) return (
    <div className="dash-layout"><Sidebar />
      <main className="dash-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Puzzle size={48} color="#9CA3AF" />
      </main>
    </div>
  );

  if (!exercise) return (
    <div className="dash-layout"><Sidebar />
      <main className="dash-content"><p>Exercice introuvable.</p></main>
    </div>
  );

  const questions = exercise.questions || [];
  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleAnswer = (option: string) => {
    if (submitted) return;
    setSelected(option);
  };

  const confirmAnswer = () => {
    if (!selected) return;
    setAnswers(prev => ({ ...prev, [q.id]: selected }));
    if (isLast) {
      setSubmitted(true);
    } else {
      setCurrentQ(c => c + 1);
      setSelected(null);
    }
  };

  const score = questions.filter(q => answers[q.id] === q.answer).length;
  const percent = Math.round((score / questions.length) * 100);

  if (submitted) {
    return (
      <div className="dash-layout">
        <Sidebar />
        <main className="dash-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div className="animate-up" style={{ textAlign: 'center', maxWidth: 480 }}>
            <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
              {percent >= 80 ? <Trophy size={80} color="var(--forest)" /> : percent >= 50 ? <ThumbsUp size={80} color="var(--ocre)" /> : <Dumbbell size={80} color="var(--terra)" />}
            </div>
            <h2 style={{ fontSize: 32, marginBottom: 12 }}>Exercice terminé !</h2>
            <p style={{ color: 'var(--gray)', marginBottom: 32 }}>Voici tes résultats pour «&nbsp;{exercise.title}&nbsp;»</p>

            <div style={{
              background: 'var(--white)', borderRadius: 'var(--radius-lg)', padding: 36,
              boxShadow: 'var(--shadow)', marginBottom: 32,
            }}>
              <div style={{ fontFamily: 'Space Mono, monospace', fontSize: 64, color: percent >= 80 ? 'var(--forest)' : percent >= 50 ? 'var(--ocre)' : 'var(--terra)', fontWeight: 700 }}>
                {percent}%
              </div>
              <div style={{ color: 'var(--gray)', marginTop: 8 }}>
                {score} bonne{score > 1 ? 's' : ''} réponse{score > 1 ? 's' : ''} sur {questions.length}
              </div>
              <div className="progress-bar-wrap" style={{ marginTop: 20 }}>
                <div className="progress-bar-fill" style={{ width: `${percent}%` }} />
              </div>
            </div>

            {/* Answer review */}
            <div style={{ textAlign: 'left', marginBottom: 32 }}>
              {questions.map((q, i) => {
                const userAnswer = answers[q.id];
                const correct = userAnswer === q.answer;
                return (
                  <div key={q.id} style={{
                    padding: '14px 16px', borderRadius: 10,
                    background: correct ? 'var(--forest-pale)' : '#fde8e4',
                    border: `1px solid ${correct ? '#c3dba8' : '#f5c4bc'}`,
                    marginBottom: 8,
                  }}>
                    <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      {correct ? <Check size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} /> : <XIcon size={13} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: 4 }} />} Q{i + 1}. {q.text}
                    </div>
                    {!correct && (
                      <div style={{ fontSize: 12, color: 'var(--gray)' }}>
                        Ta réponse : <span style={{ color: 'var(--terra)' }}>{userAnswer}</span> · Bonne réponse : <span style={{ color: 'var(--forest)' }}>{q.answer}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
              <button className="btn btn-ghost" onClick={() => { setCurrentQ(0); setAnswers({}); setSubmitted(false); setSelected(null); }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><RefreshCw size={16} /> Réessayer</span>
              </button>
              {exercise.lesson_id && (
                <Link href={`/lessons/${exercise.lesson_id}`} className="btn btn-primary">
                  ← Retour à la leçon
                </Link>
              )}
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (questions.length === 0) return (
    <div className="dash-layout"><Sidebar />
      <main className="dash-content">
        <div style={{ textAlign: 'center', padding: 60 }}>
          <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'center' }}><Puzzle size={48} color="#9CA3AF" /></div>
          <p style={{ color: 'var(--gray)' }}>Cet exercice n'a pas encore de questions.</p>
          <Link href="/lessons" className="btn btn-primary" style={{ marginTop: 20 }}>← Retour aux leçons</Link>
        </div>
      </main>
    </div>
  );

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        {/* Header */}
        <div className="animate-up" style={{ marginBottom: 32 }}>
          <div style={{ color: 'var(--gray)', fontSize: 14, marginBottom: 8 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Puzzle size={14} /> {exercise.title}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <h1 style={{ fontSize: 28 }}>Question {currentQ + 1}/{questions.length}</h1>
            <span className="badge badge-ocre">{Math.round(((currentQ) / questions.length) * 100)}% complété</span>
          </div>
          <div className="progress-bar-wrap" style={{ marginTop: 16 }}>
            <div className="progress-bar-fill" style={{ width: `${((currentQ) / questions.length) * 100}%` }} />
          </div>
        </div>

        {/* Question card */}
        <div className="animate-up delay-1" style={{ maxWidth: 680 }}>
          <div style={{
            background: 'var(--white)', borderRadius: 'var(--radius-lg)',
            padding: 36, boxShadow: 'var(--shadow)', marginBottom: 24,
          }}>
            <p style={{ fontSize: 20, fontWeight: 600, lineHeight: 1.5 }}>{q.text}</p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {q.options.map((opt, i) => {
              const isSelected = selected === opt;
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(opt)}
                  style={{
                    padding: '16px 20px', borderRadius: 12,
                    border: `2px solid ${isSelected ? 'var(--ocre)' : 'var(--gray-light)'}`,
                    background: isSelected ? 'var(--ocre-pale)' : 'var(--white)',
                    color: isSelected ? 'var(--ocre)' : 'var(--charcoal)',
                    textAlign: 'left', fontSize: 16, fontWeight: isSelected ? 600 : 400,
                    cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', alignItems: 'center', gap: 12,
                  }}
                >
                  <div style={{
                    width: 32, height: 32, borderRadius: '50%',
                    border: `2px solid ${isSelected ? 'var(--ocre)' : 'var(--gray-light)'}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 13, fontWeight: 700, flexShrink: 0,
                    background: isSelected ? 'var(--ocre)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--gray)',
                  }}>
                    {String.fromCharCode(65 + i)}
                  </div>
                  {opt}
                </button>
              );
            })}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
            <button
              className="btn btn-primary"
              onClick={confirmAnswer}
              disabled={!selected}
              style={{ opacity: selected ? 1 : 0.5, padding: '12px 28px', fontSize: 16 }}
            >
              {isLast ? <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>Terminer <Check size={16} /></span> : 'Suivant →'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
