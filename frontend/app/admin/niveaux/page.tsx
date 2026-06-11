'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '../../../components/Sidebar';
import { api, auth } from '../../../lib/api';
import { Layers, Plus, Pencil, Trash2, Check } from 'lucide-react';

interface Niveau {
  id: number;
  nom: string;
  description?: string;
  ordre: number;
  themes?: any[];
}

const EMPTY: Partial<Niveau> = { nom: '', description: '', ordre: 1 };

export default function AdminNiveauxPage() {
  const router = useRouter();
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState<'create' | 'edit' | null>(null);
  const [form, setForm] = useState<Partial<Niveau>>(EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (!auth.isLoggedIn()) { router.push('/login'); return; }
    load();
  }, [router]);

  const load = () => {
    api.get<any>('/niveaux')
      .then(data => setNiveaux(Array.isArray(data) ? data : data.niveaux ?? []))
      .finally(() => setLoading(false));
  };

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.name === 'ordre' ? Number(e.target.value) : e.target.value }));

  const openCreate = () => { setForm(EMPTY); setError(''); setModal('create'); };
  const openEdit = (n: Niveau) => { setForm(n); setError(''); setModal('edit'); };

  const save = async () => {
    setError(''); setSaving(true);
    try {
      if (modal === 'create') {
        await api.post('/niveaux', form);
        setSuccess('Niveau créé !');
      } else {
        await api.put(`/niveaux/${form.id}`, form);
        setSuccess('Niveau mis à jour !');
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
    if (!confirm('Supprimer ce niveau ? Tous les thèmes associés seront affectés.')) return;
    try {
      await api.delete(`/niveaux/${id}`);
      setNiveaux(prev => prev.filter(n => n.id !== id));
      setSuccess('Niveau supprimé.');
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
            <h1 style={{ fontSize: 32, display: 'flex', alignItems: 'center', gap: 10 }}><Layers size={28} /> Gestion des niveaux</h1>
            <p style={{ color: 'var(--gray)', marginTop: 4 }}>{niveaux.length} niveau{niveaux.length > 1 ? 'x' : ''}</p>
          </div>
          <button className="btn btn-primary" onClick={openCreate} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Plus size={16} /> Nouveau niveau
          </button>
        </div>

        {success && <div className="alert alert-success animate-in">{success}</div>}

        {loading ? (
          <div style={{ textAlign: 'center', padding: 80 }}><Layers size={40} color="#9CA3AF" /></div>
        ) : (
          <div className="animate-up delay-1" style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Nom</th>
                  <th>Description</th>
                  <th>Ordre</th>
                  <th>Thèmes</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {niveaux.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign: 'center', color: 'var(--gray)', padding: 40 }}>Aucun niveau créé</td></tr>
                ) : niveaux.map(n => (
                  <tr key={n.id}>
                    <td style={{ fontWeight: 600 }}>{n.nom}</td>
                    <td style={{ maxWidth: 250, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: 'var(--gray)' }}>
                      {n.description || '—'}
                    </td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{n.ordre}</td>
                    <td style={{ fontFamily: 'Space Mono, monospace', color: 'var(--gray)' }}>{n.themes?.length ?? '—'}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-ghost" style={{ padding: '6px 12px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 4 }} onClick={() => openEdit(n)}><Pencil size={13} /> Modifier</button>
                        <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: 13 }} onClick={() => remove(n.id)}><Trash2 size={13} /></button>
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
                {modal === 'create' ? <><Plus size={18} /> Nouveau niveau</> : <><Pencil size={18} /> Modifier le niveau</>}
              </h2>
              {error && <div className="alert alert-error">{error}</div>}

              <div className="form-group">
                <label className="label">Nom *</label>
                <input className="input-field" name="nom" value={form.nom || ''} onChange={handle} placeholder="Ex: Débutant" />
              </div>
              <div className="form-group">
                <label className="label">Ordre d'affichage</label>
                <input className="input-field" name="ordre" type="number" min={1} value={form.ordre ?? 1} onChange={handle} />
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea className="input-field" name="description" value={form.description || ''} onChange={handle as React.ChangeEventHandler<HTMLTextAreaElement>} placeholder="Description du niveau..." rows={3} style={{ resize: 'vertical' }} />
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
