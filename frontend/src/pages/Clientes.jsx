import { useEffect, useState } from 'react';
import api from '../api/api';

const empty = { Nome: '', NumeroMesa: '' };

export default function Clientes() {
  const [clientes, setClientes] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const load = () => api.get('/clientes').then(r => setClientes(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.Nome || !form.NumeroMesa) return alert('Preencha todos os campos');
    setLoading(true);
    if (editId) await api.put(`/clientes/${editId}`, form);
    else await api.post('/clientes', form);
    setForm(empty); setEditId(null); await load(); setLoading(false);
  };

  const edit = (c) => { setForm({ Nome: c.Nome, NumeroMesa: c.NumeroMesa }); setEditId(c.Id); };

  const del = async (id) => {
    if (!confirm('Remover cliente?')) return;
    await api.delete(`/clientes/${id}`); load();
  };

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>Clientes</h2>
      </div>

      {/* Formulário */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: '1rem' }}>
          {editId ? 'Editar Cliente' : 'Novo Cliente'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Nome</label>
            <input style={inputStyle} value={form.Nome}
              onChange={e => setForm({ ...form, Nome: e.target.value })} placeholder="Nome do cliente" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Número da Mesa</label>
            <input style={inputStyle} type="number" value={form.NumeroMesa}
              onChange={e => setForm({ ...form, NumeroMesa: e.target.value })} placeholder="Ex: 1" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} disabled={loading} style={{
            background: 'var(--accent)', color: '#000', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13,
          }}>{loading ? 'Salvando...' : editId ? 'Salvar' : 'Cadastrar'}</button>
          {editId && (
            <button onClick={() => { setForm(empty); setEditId(null); }} style={{
              background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 20px', fontSize: 13,
            }}>Cancelar</button>
          )}
        </div>
      </div>

      {/* Tabela */}
      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['ID','Nome','Mesa','Ações'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '12px 16px', fontSize: 12, color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clientes.map(c => (
              <tr key={c.Id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '12px 16px', color: 'var(--muted)' }}>#{c.Id}</td>
                <td style={{ padding: '12px 16px', fontWeight: 500 }}>{c.Nome}</td>
                <td style={{ padding: '12px 16px' }}>Mesa {c.NumeroMesa}</td>
                <td style={{ padding: '12px 16px' }}>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button onClick={() => edit(c)} style={{
                      background: 'rgba(240,193,75,0.1)', color: 'var(--accent)', border: 'none',
                      borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    }}>Editar</button>
                    <button onClick={() => del(c.Id)} style={{
                      background: 'rgba(224,92,92,0.1)', color: 'var(--danger)', border: 'none',
                      borderRadius: 6, padding: '6px 14px', fontSize: 12, fontWeight: 600,
                    }}>Remover</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}