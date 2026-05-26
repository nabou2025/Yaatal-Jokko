'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Sidebar from '../../../components/Sidebar';
import { api, auth, Lesson } from '../../../lib/api';
import { ClipboardList, Plus, BookOpen, Eye, Pencil, Trash2, Check } from 'lucide-react';

const EMPTY: Partial<Lesson> = { title: '', description: '', level: 'beginner' };

export default function AdminLessonsPage() {
  const router = useRouter();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Lesson>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    load();
  }, [router]);

  const load = () => {
    api.get<Lesson[]>('/lessons')
      .then(data => setLessons(Array.isArray(data) ? data : []))
      .finally(() => setLoading(false));
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const openCreate = () => { setForm(EMPTY); setError(''); setModal('create'); };
  const openEdit = (l: Lesson) => { setForm(l); setError(''); setModal('edit'); };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/lessons', form);
        setSuccess('Leçon créée !');
      } else {
        await api.put(`/lessons/${form.id}`, form);
        setSuccess('Leçon mise à jour !');
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
    if (!confirm('Supprimer cette leçon ?')) return;
    try {
      await api.delete(`/lessons/${id}`);
      setLessons(prev => prev.filter(l => l.id !== id));
      setSuccess('Leçon supprimée.');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : 'Erreur');
    }
  };

  const levelLabel = (level: string) => ({ beginner: 'Débutant', intermediate: 'Intermédiaire', advanced: 'Avancé' }[level] || level);
  const levelColor = (level: string) => ({ beginner: 'badge-forest', intermediate: 'badge-ocre', advanced: 'badge-terra' }[level] || 'badge-ocre');

  return (
    <div className="dash-layout">
      <Sidebar />
      <main className="dash-content">
        <div className="dash-header animate-up" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 10 }}><ClipboardList size={28} /> Gestion des leçons</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{lessons.length} leçon{lessons.length > 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}><Plus size={16} /> Nouvelle leçon</button>
        </div>

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><BookOpen size={40} color="#9CA3AF" /></div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Titre</th>
                  <th>Niveau</th>
                  <th>Description</th>
                  <th>Signes</th>
                  <th>Exercices</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.length === 0 ? (
                  <tr><td colSpan={6} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucune leçon créée</td></tr>
                ) : lessons.map(l => (
                  <tr key={l.id}>
                    <td style={{ fontWeight: 600 }}>{l.title}</td>
                    <td><span className={`badge ${levelColor(l.level)}`}>{levelLabel(l.level)}</span></td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                      {l.description || '—'}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{l.signs?.length ?? '—'}</td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{l.exercises?.length ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <Link href={`/lessons/${l.id}`} className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }}><Eye size={13} /> Voir</Link>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(l)}><Pencil size={13} /> Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center' }} onClick={() => remove(l.id)}><Trash2 size={13} /></button>
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
              <h2 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>{modal === 'create' ? <><Plus size={18} /> Nouvelle leçon</> : <><Pencil size={18} /> Modifier la leçon</>}</h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="label">Titre *</label>
                <input className="input-field" name="title" value={form.title || ''} onChange={handle} placeholder="Ex: L'alphabet en langue des signes" />
              </div>
              <div className="form-group">
                <label className="label">Niveau *</label>
                <select className="input-field" name="level" value={form.level || 'beginner'} onChange={handle}>
                  <option value="beginner">Débutant</option>
                  <option value="intermediate">Intermédiaire</option>
                  <option value="advanced">Avancé</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description de la leçon..." rows={4} style={{ resize: 'vertical' }} />
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
