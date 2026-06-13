'use client';
import '../admin.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth } from '../../../lib/api';
import { Tag, Plus, Pencil, Trash2, Check } from 'lucide-react';

interface Theme {
  id: number;
  nom: string;
  description?: string;
  niveau_id: number;
  ordre: number;
  niveau?: { id: number; nom: string };
  lecons?: any[];
}

interface Niveau {
  id: number;
  nom: string;
}

const EMPTY: Partial<Theme> = { nom: '', description: '', niveau_id: 0, ordre: 1 };

export default function AdminThemesPage() {
  const router = useRouter();
  const [themes, setThemes] = useState<Theme[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Theme>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    Promise.all([
      api.get<any>('/themes'),
      api.get<any>('/niveaux'),
    ]).then(([tData, nData]) => {
      setThemes(Array.isArray(tData) ? tData : tData.themes ?? []);
      setNiveaux(Array.isArray(nData) ? nData : nData.niveaux ?? []);
    }).finally(() => setLoading(false));
  }, [router]);

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: ['niveau_id', 'ordre'].includes(e.target.name) ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setForm({ ...EMPTY, niveau_id: niveaux[0]?.id || 0 }); setError(''); setModal('create'); };
  const openEdit = (t: Theme) => { setForm(t); setError(''); setModal('edit'); };

  const load = () => {
    api.get<any>('/themes').then(data => setThemes(Array.isArray(data) ? data : data.themes ?? []));
  };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/themes', form);
        setSuccess('Thème créé !');
      } else {
        await api.put(`/themes/${form.id}`, form);
        setSuccess('Thème mis à jour !');
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
    if (!confirm('Supprimer ce thème ?')) return;
    try {
      await api.delete(`/themes/${id}`);
      setThemes(prev => prev.filter(t => t.id !== id));
      setSuccess('Thème supprimé.');
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
            <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 10 }}><Tag size={28} /> Gestion des thèmes</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{themes.length} thème{themes.length > 1 ? 's' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouveau thème
          </button>
        </div>

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><Tag size={40} color="#9CA3AF" /></div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Niveau</th>
                  <th>Description</th>
                  <th>Leçons</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {themes.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucun thème créé</td></tr>
                ) : themes.map(t => (
                  <tr key={t.id}>
                    <td style={{ fontWeight: 600 }}>{t.nom}</td>
                    <td style={{ color: 'var(--ocre)', fontSize: 13 }}>
                      {t.niveau?.nom || niveaux.find(n => n.id === t.niveau_id)?.nom || `Niveau #${t.niveau_id}`}
                    </td>
                    <td style={{ maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                      {t.description || '—'}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{t.lecons?.length ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(t)}><Pencil size={13} /> Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => remove(t.id)}><Trash2 size={13} /></button>
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
                {modal === 'create' ? <><Plus size={18} /> Nouveau thème</> : <><Pencil size={18} /> Modifier le thème</>}
              </h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="label">Nom *</label>
                <input className="input-field" name="nom" value={form.nom || ''} onChange={handle} placeholder="Ex: Alphabet" />
              </div>
              <div className="form-group">
                <label className="label">Niveau associé *</label>
                <select className="input-field" name="niveau_id" value={form.niveau_id || ''} onChange={handle}>
                  {niveaux.map(n => <option key={n.id} value={n.id}>{n.nom}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description du thème..." rows={3} style={{ resize: 'vertical' }} />
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
