'use client';
import '../admin.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth } from '../../../lib/api';
import { BookMarked, Plus, Pencil, Trash2, Check, ChevronDown, ChevronUp, X } from 'lucide-react';

interface Reponse {
  id?: number;
  texte: string;
  est_correcte: boolean;
}

interface QuestionForm {
  id?: number;
  enonce: string;
  ordre: number;
  reponses: Reponse[];
}

interface Quiz {
  id: number;
  titre: string;
  description?: string;
  theme_id: number;
  note_passage: number;
  ordre: number;
  theme?: { id: number; nom: string };
  questions?: any[];
  questions_count?: number;
}

interface Theme {
  id: number;
  nom: string;
}

const EMPTY_QUIZ: Partial<Quiz> = { titre: '', description: '', theme_id: 0, note_passage: 60, ordre: 1 };
const EMPTY_QUESTION = (): QuestionForm => ({
  enonce: '',
  ordre: 1,
  reponses: [
    { texte: '', est_correcte: true },
    { texte: '', est_correcte: false },
    { texte: '', est_correcte: false },
  ],
});

export default function AdminQuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Quiz>>(EMPTY_QUIZ);
  const [questions, setQuestions] = useState<QuestionForm[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [expandedQuiz, setExpandedQuiz] = useState<number | null>(null);
  const [expandedDetails, setExpandedDetails] = useState<any | null>(null);

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    load();
  }, [router]);

  const load = () => {
    Promise.all([
      api.get<any>('/quiz'),
      api.get<any>('/themes'),
    ]).then(([qData, tData]) => {
      setQuizzes(qData.quiz ?? (Array.isArray(qData) ? qData : []));
      setThemes(tData.themes ?? (Array.isArray(tData) ? tData : []));
    }).finally(() => setLoading(false));
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: ['theme_id', 'note_passage', 'ordre'].includes(e.target.name) ? Number(e.target.value) : e.target.value }));

  const openCreate = () => {
    setForm({ ...EMPTY_QUIZ, theme_id: themes[0]?.id || 0 });
    setQuestions([EMPTY_QUESTION()]);
    setError('');
    setModal('create');
  };

  const openEdit = (q: Quiz) => {
    setForm(q);
    setQuestions([]); // en édition on n'ajoute que de nouvelles questions
    setError('');
    setModal('edit');
  };

  // Gestion questions
  const addQuestion = () => setQuestions(prev => [...prev, { ...EMPTY_QUESTION(), ordre: prev.length + 1 }]);
  const removeQuestion = (i: number) => setQuestions(prev => prev.filter((_, idx) => idx !== i));

  const handleQuestionText = (i: number, value: string) =>
    setQuestions(prev => prev.map((q, idx) => idx === i ? { ...q, enonce: value } : q));

  const handleReponseText = (qi: number, ri: number, value: string) =>
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, reponses: q.reponses.map((r, ridx) => ridx === ri ? { ...r, texte: value } : r) } : q));

  const setCorrectAnswer = (qi: number, ri: number) =>
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, reponses: q.reponses.map((r, ridx) => ({ ...r, est_correcte: ridx === ri })) } : q));

  const addReponse = (qi: number) =>
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, reponses: [...q.reponses, { texte: '', est_correcte: false }] } : q));

  const removeReponse = (qi: number, ri: number) =>
    setQuestions(prev => prev.map((q, idx) => idx === qi ? { ...q, reponses: q.reponses.filter((_, ridx) => ridx !== ri) } : q));

  const save = async () => {
    setError(''); setSaving(true);
    try {
      let quizId: number;
      if (modal === 'create') {
        const res = await api.post<any>('/quiz', form);
        quizId = res.quiz?.id || res.id;
        setSuccess('Quiz créé !');
      } else {
        await api.put(`/quiz/${form.id}`, form);
        quizId = form.id!;
        setSuccess('Quiz mis à jour !');
      }

      // Créer chaque question puis ses réponses
      for (const q of questions) {
        if (!q.enonce.trim()) continue;
        const qRes = await api.post<any>(`/quiz/${quizId}/questions`, {
          enonce: q.enonce,
          ordre: q.ordre,
        });
        const questionId = qRes.question?.id;
        for (const r of q.reponses) {
          if (!r.texte.trim()) continue;
          await api.post(`/questions/${questionId}/reponses`, {
            texte: r.texte,
            est_correcte: r.est_correcte,
          });
        }
      }

      setModal(null);
      load();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer ce quiz ?')) return;
    try {
      await api.delete(`/quiz/${id}`);
      setQuizzes(prev => prev.filter(q => q.id !== id));
      setSuccess('Quiz supprimé.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const toggleExpand = async (q: Quiz) => {
    if (expandedQuiz === q.id) { setExpandedQuiz(null); return; }
    setExpandedQuiz(q.id);
    if (!expandedDetails || expandedDetails.id !== q.id) {
      const res = await api.get<any>(`/quiz/${q.id}`);
      setExpandedDetails(res.quiz);
    }
  };

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        <div className="dash-header animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 10 }}><BookMarked size={28} /> Gestion des quiz</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{quizzes.length} quiz</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouveau quiz
          </button>
        </div>

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><BookMarked size={40} color="#9CA3AF" /></div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Thème</th>
                  <th>Note de passage</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {quizzes.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucun quiz créé</td></tr>
                ) : quizzes.map(q => (
                  <>
                    <tr key={q.id}>
                      <td style={{ fontWeight: 600 }}>{q.titre}</td>
                      <td style={{ color: 'var(--ocre)', fontSize: 13 }}>
                        {q.theme?.nom || themes.find(t => t.id === q.theme_id)?.nom || `Thème #${q.theme_id}`}
                      </td>
                      <td style={{ fontFamily: 'Space Mono, monospace' }}>{q.note_passage}%</td>
                      <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 4, color: 'var(--gray)' }}
                          onClick={() => toggleExpand(q)}>
                          {q.questions_count ?? 0} {expandedQuiz === q.id ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                        </button>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(q)}><Pencil size={13} /> Modifier</button>
                          <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => remove(q.id)}><Trash2 size={13} /></button>
                        </div>
                      </td>
                    </tr>
                    {expandedQuiz === q.id && expandedDetails?.id === q.id && expandedDetails.questions?.map((qu: any, i: number) => (
                      <tr key={`q-${i}`} style={{ background: '#fdf6f4' }}>
                        <td colSpan={5} style={{ paddingLeft: 32, fontSize: 13, color: '#2D3561' }}>
                          <strong>Q{i + 1}:</strong> {qu.enonce}
                          <div style={{ marginTop: 4, color: 'var(--gray)' }}>
                            {qu.reponses?.map((r: any, ri: number) => (
                              <span key={ri} style={{ marginRight: 12 }}>{r.texte}</span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()} style={{ maxWidth: 620, maxHeight: '90vh', overflowY: 'auto' }}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {modal === 'create' ? <><Plus size={18} /> Nouveau quiz</> : <><Pencil size={18} /> Modifier le quiz</>}
              </h2>
              {error && <div className="alert alert-error">{error}</div>}

              {/* Infos quiz */}
              <div className="form-group">
                <label className="label">Titre *</label>
                <input className="input-field" name="titre" value={form.titre || ''} onChange={handle} placeholder="Ex: Quiz alphabet" />
              </div>
              <div className="form-group">
                <label className="label">Thème associé *</label>
                <select className="input-field" name="theme_id" value={form.theme_id || ''} onChange={handle}>
                  {themes.map(t => <option key={t.id} value={t.id}>{t.nom}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Note de passage (%) *</label>
                <input className="input-field" name="note_passage" type="number" min={0} max={100} value={form.note_passage ?? 60} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description du quiz..." rows={2} style={{ resize: 'vertical' }} />
              </div>

              {/* Questions */}
              <div style={{ borderTop: '1px solid #F3F4F6', marginTop: 16, paddingTop: 16 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <h3 style={{ fontSize: 15, fontWeight: 700, color: '#2D3561' }}>
                    {modal === 'create' ? `Questions (${questions.length})` : 'Ajouter de nouvelles questions'}
                  </h3>
                  <button className="btn btn-ghost" style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={addQuestion}>
                    <Plus size={14} /> Ajouter une question
                  </button>
                </div>

                {questions.map((q, qi) => (
                  <div key={qi} style={{ background: '#fdf6f4', borderRadius: 10, padding: 16, marginBottom: 12, position: 'relative' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: '#2D3561' }}>Question {qi + 1}</span>
                      <button onClick={() => removeQuestion(qi)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><X size={14} /></button>
                    </div>

                    <div className="form-group">
                      <label className="label">Énoncé de la question *</label>
                      <input className="input-field" value={q.enonce} onChange={e => handleQuestionText(qi, e.target.value)} placeholder="Ex: Quel signe représente la lettre A ?" />
                    </div>

                    <div className="form-group">
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <label className="label">Réponses (cocher la bonne) *</label>
                        <button className="btn btn-ghost" style={{ fontSize: 12, padding: '2px 8px' }} onClick={() => addReponse(qi)}>+ Réponse</button>
                      </div>
                      {q.reponses.map((r, ri) => (
                        <div key={ri} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'center' }}>
                          <input
                            type="radio"
                            name={`correct-${qi}`}
                            checked={r.est_correcte}
                            onChange={() => setCorrectAnswer(qi, ri)}
                            title="Bonne réponse"
                          />
                          <input className="input-field" value={r.texte} onChange={e => handleReponseText(qi, ri, e.target.value)} placeholder={`Réponse ${ri + 1}`} style={{ flex: 1 }} />
                          {q.reponses.length > 2 && (
                            <button onClick={() => removeReponse(qi, ri)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#EF4444' }}><X size={14} /></button>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end', marginTop: 8 }}>
                <button className="btn btn-ghost" onClick={() => setModal(null)}>Annuler</button>
                <button className="btn btn-primary" onClick={save} disabled={saving}>
                  {saving ? 'Enregistrement...' : <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Check size={16} /> Enregistrer</span>}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
