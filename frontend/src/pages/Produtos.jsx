import { useEffect, useState } from 'react';
import api from '../api/api';

const empty = { Nome: '', Preco: '' };

export default function Produtos() {
  const [produtos, setProdutos] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);

  const load = () => api.get('/produtos').then(r => setProdutos(r.data));
  useEffect(() => { load(); }, []);

  const save = async () => {
    if (!form.Nome || !form.Preco) return alert('Preencha todos os campos');
    if (editId) await api.put(`/produtos/${editId}`, form);
    else await api.post('/produtos', form);
    setForm(empty); setEditId(null); load();
  };

  const edit = (p) => { setForm({ Nome: p.Nome, Preco: p.Preco }); setEditId(p.Id); };
  const del = async (id) => { if (!confirm('Remover produto?')) return; await api.delete(`/produtos/${id}`); load(); };

  const inputStyle = {
    width: '100%', background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '10px 14px', color: 'var(--text)', fontSize: 14,
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>Produtos</h2>
      </div>

      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem',
      }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: '1rem' }}>
          {editId ? 'Editar Produto' : 'Novo Produto'}
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Nome</label>
            <input style={inputStyle} value={form.Nome}
              onChange={e => setForm({ ...form, Nome: e.target.value })} placeholder="Nome do produto" />
          </div>
          <div>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Preço (R$)</label>
            <input style={inputStyle} type="number" step="0.01" value={form.Preco}
              onChange={e => setForm({ ...form, Preco: e.target.value })} placeholder="0.00" />
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={save} style={{
            background: 'var(--accent)', color: '#000', border: 'none',
            borderRadius: 8, padding: '10px 24px', fontWeight: 700, fontSize: 13,
          }}>{editId ? 'Salvar' : 'Cadastrar'}</button>
          {editId && (
            <button onClick={() => { setForm(empty); setEditId(null); }} style={{
              background: 'transparent', color: 'var(--muted)', border: '1px solid var(--border)',
              borderRadius: 8, padding: '10px 20px', fontSize: 13,
            }}>Cancelar</button>
          )}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
        {produtos.map(p => (
          <div key={p.Id} style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <span style={{ fontSize: 11, color: 'var(--muted)' }}>#{p.Id}</span>
              <span style={{
                background: 'rgba(232,124,62,0.15)', color: 'var(--accent2)',
                fontSize: 14, fontWeight: 700, padding: '2px 8px', borderRadius: 6,
              }}>
                R$ {Number(p.Preco).toFixed(2)}
              </span>
            </div>
            <p style={{ fontWeight: 600, fontSize: 15, marginBottom: 16 }}>{p.Nome}</p>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => edit(p)} style={{
                flex: 1, background: 'rgba(240,193,75,0.1)', color: 'var(--accent)',
                border: 'none', borderRadius: 6, padding: '7px 0', fontSize: 12, fontWeight: 600,
              }}>Editar</button>
              <button onClick={() => del(p.Id)} style={{
                flex: 1, background: 'rgba(224,92,92,0.1)', color: 'var(--danger)',
                border: 'none', borderRadius: 6, padding: '7px 0', fontSize: 12, fontWeight: 600,
              }}>Remover</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}