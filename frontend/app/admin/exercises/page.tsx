'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth, Exercise, Lesson } from '../../../lib/api';
import { Puzzle, Plus, AlertTriangle, Pencil, Trash2, Lightbulb, Check } from 'lucide-react';

const EMPTY_EX = { title: '', description: '', lesson_id: 0, questions: [] };

export default function AdminExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Exercise>>(EMPTY_EX);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    Promise.all([
      api.get<Exercise[]>('/exercises'),
      api.get<Lesson[]>('/lessons'),
    ]).then(([ex, les]) => {
      setExercises(Array.isArray(ex) ? ex : []);
      setLessons(Array.isArray(les) ? les : []);
    }).finally(() => setLoading(false));
  }, [router]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.name === 'lesson_id' ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setForm({ ...EMPTY_EX, lesson_id: lessons[0]?.id || 0 }); setError(''); setModal('create'); };
  const openEdit = (ex: Exercise) => { setForm(ex); setError(''); setModal('edit'); };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/exercises', form);
        setSuccess('Exercice créé !');
      } else {
        await api.put(`/exercises/${form.id}`, form);
        setSuccess('Exercice mis à jour !');
      }
      setModal(null);
      const data = await api.get<Exercise[]>('/exercises');
      setExercises(Array.isArray(data) ? data : []);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Erreur');
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: number) => {
    if (!confirm('Supprimer cet exercice ?')) return;
    try {
      await api.delete(`/exercises/${id}`);
      setExercises(prev => prev.filter(e => e.id !== id));
      setSuccess('Exercice supprimé.');
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
            <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 10 }}><Puzzle size={28} /> Gestion des exercices</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{exercises.length} exercice{exercises.length > 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} disabled={lessons.length === 0}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} /> Nouvel exercice</span>
          </button>
        </div>

        {lessons.length === 0 && !loading && (
          <div className="alert alert-error" style={{ display: 'flex', alignItems: 'center', gap: 6 }}><AlertTriangle size={14} /> Créez d&apos;abord une leçon avant d&apos;ajouter des exercices.</div>
        )}

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><Puzzle size={40} color="#9CA3AF" /></div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Leçon</th>
                  <th>Description</th>
                  <th>Questions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {exercises.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucun exercice créé</td></tr>
                ) : exercises.map(ex => (
                  <tr key={ex.id}>
                    <td style={{ fontWeight: 600 }}>{ex.title}</td>
                    <td style={{ color: 'var(--ocre)', fontSize: 13 }}>
                      {ex.lesson?.title || lessons.find(l => l.id === ex.lesson_id)?.title || `Leçon #${ex.lesson_id}`}
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                      {ex.description || '—'}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>
                      {ex.questions?.length ?? 0}
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(ex)}><Pencil size={13} /> Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center' }} onClick={() => remove(ex.id)}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal */}
        {modal && (
          <div className="modal-overlay" onClick={() => setModal(null)}>
            <div className="modal-box" onClick={e => e.stopPropagation()}>
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{modal === 'create' ? <><Plus size={18} /> Nouvel exercice</> : <><Pencil size={18} /> Modifier l&apos;exercice</>}</h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="label">Titre *</label>
                <input className="input-field" name="title" value={form.title || ''} onChange={handle} placeholder="Ex: Quiz alphabet" />
              </div>
              <div className="form-group">
                <label className="label">Leçon associée *</label>
                <select className="input-field" name="lesson_id" value={form.lesson_id || ''} onChange={handle}>
                  {lessons.map(l => <option key={l.id} value={l.id}>{l.title}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description de l'exercice..." rows={3} style={{ resize: 'vertical' }} />
              </div>

              <div style={{ background: 'var(--ocre-pale)', borderRadius: 10, padding: '12px 16px', fontSize: 13, color: 'var(--ocre)', marginBottom: 16 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Lightbulb size={14} /> Les questions (JSON) peuvent être ajoutées directement en base de données ou via l&apos;API.</span>
              </div>

              <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
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
