'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth } from '../../../lib/api';
import { BookMarked, Plus, Pencil, Trash2, Check } from 'lucide-react';

interface Quiz {
  id: number;
  titre: string;
  description?: string;
  theme_id: number;
  note_passage: number;
  ordre: number;
  theme?: { id: number; nom: string };
  questions?: any[];
}

interface Theme {
  id: number;
  nom: string;
}

const EMPTY: Partial<Quiz> = { titre: '', description: '', theme_id: 0, note_passage: 50, ordre: 1 };

export default function AdminQuizPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [themes, setThemes] = useState<Theme[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Quiz>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    Promise.all([
      api.get<any>('/quiz'),
      api.get<any>('/themes'),
    ]).then(([qData, tData]) => {
      setQuizzes(Array.isArray(qData) ? qData : qData.quizzes ?? []);
      setThemes(Array.isArray(tData) ? tData : tData.themes ?? []);
    }).finally(() => setLoading(false));
  }, [router]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: ['theme_id', 'note_passage', 'ordre'].includes(e.target.name) ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setForm({ ...EMPTY, theme_id: themes[0]?.id || 0 }); setError(''); setModal('create'); };
  const openEdit = (q: Quiz) => { setForm(q); setError(''); setModal('edit'); };

  const load = () => {
    api.get<any>('/quiz').then(data => setQuizzes(Array.isArray(data) ? data : data.quizzes ?? []));
  };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/quiz', form);
        setSuccess('Quiz créé !');
      } else {
        await api.put(`/quiz/${form.id}`, form);
        setSuccess('Quiz mis à jour !');
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
                  <tr key={q.id}>
                    <td style={{ fontWeight: 600 }}>{q.titre}</td>
                    <td style={{ color: 'var(--ocre)', fontSize: 13 }}>
                      {q.theme?.nom || themes.find(t => t.id === q.theme_id)?.nom || `Thème #${q.theme_id}`}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace' }}>{q.note_passage}%</td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{q.questions?.length ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(q)}><Pencil size={13} /> Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => remove(q.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {modal === 'create' ? <><Plus size={18} /> Nouveau quiz</> : <><Pencil size={18} /> Modifier le quiz</>}
              </h2>
              {error && <div className="alert alert-error">{error}</div>}

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
                <input className="input-field" name="note_passage" type="number" min={0} max={100} value={form.note_passage ?? 50} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description du quiz..." rows={3} style={{ resize: 'vertical' }} />
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
