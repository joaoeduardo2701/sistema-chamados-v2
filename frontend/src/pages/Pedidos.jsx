import { useEffect, useState } from 'react';
import api from '../api/api';

const StatusBadge = ({ s }) => {
  const map = { pendente: ['#e0a832','rgba(224,168,50,0.12)'], aprovado: ['#4caf84','rgba(76,175,132,0.12)'], cancelado: ['#e05c5c','rgba(224,92,92,0.12)'] };
  const [color, bg] = map[s] || ['#888','transparent'];
  return <span style={{ background: bg, color, fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1 }}>{s}</span>;
};

export default function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [detalhe, setDetalhe] = useState(null);
  const [criando, setCriando] = useState(false);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([{ ProdutoId: '', Quantidade: 1 }]);

  const load = () => api.get('/pedidos').then(r => setPedidos(r.data));

  useEffect(() => {
    load();
    api.get('/clientes').then(r => setClientes(r.data));
    api.get('/produtos').then(r => setProdutos(r.data));
  }, []);

  const verDetalhe = async (id) => {
    const r = await api.get(`/pedidos/${id}`);
    setDetalhe(r.data);
  };

  const atualizarStatus = async (id, Status) => {
    await api.patch(`/pedidos/${id}/status`, { Status });
    load();
    if (detalhe?.Id === id) verDetalhe(id);
  };

  const addItem = () => setItens([...itens, { ProdutoId: '', Quantidade: 1 }]);
  const removeItem = (i) => setItens(itens.filter((_, idx) => idx !== i));
  const setItem = (i, field, val) => setItens(itens.map((it, idx) => idx === i ? { ...it, [field]: val } : it));

  const criarPedido = async () => {
    if (!clienteId) return alert('Selecione um cliente');
    if (itens.some(i => !i.ProdutoId)) return alert('Selecione todos os produtos');
    await api.post('/pedidos', { ClienteId: clienteId, itens });
    setCriando(false); setClienteId(''); setItens([{ ProdutoId: '', Quantidade: 1 }]);
    load();
  };

  const del = async (id) => {
    if (!confirm('Remover pedido?')) return;
    await api.delete(`/pedidos/${id}`); load();
    if (detalhe?.Id === id) setDetalhe(null);
  };

  const selectStyle = {
    background: 'var(--surface2)', border: '1px solid var(--border)',
    borderRadius: 8, padding: '9px 12px', color: 'var(--text)', fontSize: 13, width: '100%',
  };

  const totalDetalhe = detalhe?.itens?.reduce((s, i) => s + Number(i.Subtotal), 0) || 0;

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>Pedidos</h2>
        </div>
        <button onClick={() => { setCriando(!criando); setDetalhe(null); }} style={{
          background: 'var(--accent)', color: '#000', border: 'none',
          borderRadius: 8, padding: '10px 20px', fontWeight: 700, fontSize: 13,
        }}>
          {criando ? '✕ Cancelar' : '+ Novo Pedido'}
        </button>
      </div>

      {/* Formulário novo pedido */}
      {criando && (
        <div style={{
          background: 'var(--surface)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius)', padding: '1.5rem', marginBottom: '2rem',
        }}>
          <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 15, fontWeight: 700, marginBottom: '1rem' }}>Novo Pedido</h3>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 6 }}>Cliente</label>
            <select style={selectStyle} value={clienteId} onChange={e => setClienteId(e.target.value)}>
              <option value="">Selecione...</option>
              {clientes.map(c => <option key={c.Id} value={c.Id}>{c.Nome} — Mesa {c.NumeroMesa}</option>)}
            </select>
          </div>

          <label style={{ fontSize: 12, color: 'var(--muted)', display: 'block', marginBottom: 8 }}>Itens do Pedido</label>
          {itens.map((item, i) => (
            <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 100px 36px', gap: 8, marginBottom: 8 }}>
              <select style={selectStyle} value={item.ProdutoId} onChange={e => setItem(i, 'ProdutoId', e.target.value)}>
                <option value="">Produto...</option>
                {produtos.map(p => <option key={p.Id} value={p.Id}>{p.Nome} — R$ {Number(p.Preco).toFixed(2)}</option>)}
              </select>
              <input type="number" min="1" value={item.Quantidade}
                onChange={e => setItem(i, 'Quantidade', e.target.value)}
                style={{ ...selectStyle, textAlign: 'center' }} />
              <button onClick={() => removeItem(i)} style={{
                background: 'rgba(224,92,92,0.1)', color: 'var(--danger)',
                border: 'none', borderRadius: 8, fontSize: 16,
              }}>✕</button>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 10, marginTop: 12 }}>
            <button onClick={addItem} style={{
              background: 'transparent', color: 'var(--muted)', border: '1px dashed var(--border)',
              borderRadius: 8, padding: '8px 16px', fontSize: 13,
            }}>+ Adicionar item</button>
            <button onClick={criarPedido} style={{
              background: 'var(--accent)', color: '#000', border: 'none',
              borderRadius: 8, padding: '8px 24px', fontWeight: 700, fontSize: 13,
            }}>Confirmar Pedido</button>
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: detalhe ? '1fr 360px' : '1fr', gap: 20 }}>
        {/* Lista */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                {['#','Cliente','Mesa','Data','Status',''].map((h, i) => (
                  <th key={i} style={{ textAlign: 'left', padding: '12px 14px', fontSize: 11, color: 'var(--muted)', fontWeight: 500, textTransform: 'uppercase', letterSpacing: 1 }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pedidos.map(p => (
                <tr key={p.Id}
                  onClick={() => verDetalhe(p.Id)}
                  style={{
                    borderBottom: '1px solid var(--border)', cursor: 'pointer',
                    background: detalhe?.Id === p.Id ? 'rgba(240,193,75,0.05)' : 'transparent',
                    transition: 'background 0.1s',
                  }}>
                  <td style={{ padding: '12px 14px', color: 'var(--muted)' }}>#{p.Id}</td>
                  <td style={{ padding: '12px 14px', fontWeight: 500 }}>{p.Cliente}</td>
                  <td style={{ padding: '12px 14px' }}>{p.NumeroMesa}</td>
                  <td style={{ padding: '12px 14px', color: 'var(--muted)' }}>
                    {new Date(p.Data).toLocaleDateString('pt-BR')}
                  </td>
                  <td style={{ padding: '12px 14px' }}><StatusBadge s={p.Status} /></td>
                  <td style={{ padding: '12px 14px' }}>
                    <button onClick={(e) => { e.stopPropagation(); del(p.Id); }} style={{
                      background: 'rgba(224,92,92,0.1)', color: 'var(--danger)',
                      border: 'none', borderRadius: 6, padding: '4px 10px', fontSize: 11, fontWeight: 600,
                    }}>Excluir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Detalhe */}
        {detalhe && (
          <div style={{
            background: 'var(--surface)', border: '1px solid var(--border)',
            borderRadius: 'var(--radius)', padding: '1.25rem',
            position: 'sticky', top: '2rem', alignSelf: 'flex-start',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700 }}>
                Pedido #{detalhe.Id}
              </h3>
              <button onClick={() => setDetalhe(null)} style={{
                background: 'transparent', border: 'none', color: 'var(--muted)', fontSize: 18, lineHeight: 1,
              }}>✕</button>
            </div>

            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: '1rem', lineHeight: 1.8 }}>
              <div><strong style={{ color: 'var(--text)' }}>Cliente:</strong> {detalhe.Cliente}</div>
              <div><strong style={{ color: 'var(--text)' }}>Mesa:</strong> {detalhe.NumeroMesa}</div>
              <div><strong style={{ color: 'var(--text)' }}>Data:</strong> {new Date(detalhe.Data).toLocaleString('pt-BR')}</div>
            </div>

            <div style={{ marginBottom: '1rem' }}>
              <label style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, display: 'block', marginBottom: 6 }}>Status</label>
              <div style={{ display: 'flex', gap: 6 }}>
                {['pendente','aprovado','cancelado'].map(s => (
                  <button key={s} onClick={() => atualizarStatus(detalhe.Id, s)} style={{
                    flex: 1, padding: '7px 0', fontSize: 11, fontWeight: 700, borderRadius: 6, border: 'none', textTransform: 'uppercase', letterSpacing: 0.5,
                    background: detalhe.Status === s ? 'var(--accent)' : 'var(--surface2)',
                    color: detalhe.Status === s ? '#000' : 'var(--muted)',
                  }}>{s}</button>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
              <p style={{ fontSize: 11, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>Itens</p>
              {detalhe.itens?.map(item => (
                <div key={item.Id} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: 13,
                }}>
                  <div>
                    <p style={{ fontWeight: 500 }}>{item.Produto}</p>
                    <p style={{ color: 'var(--muted)', fontSize: 12 }}>
                      {item.Quantidade}x · R$ {Number(item.Preco).toFixed(2)}
                    </p>
                  </div>
                  <span style={{ fontWeight: 600, color: 'var(--accent2)' }}>
                    R$ {Number(item.Subtotal).toFixed(2)}
                  </span>
                </div>
              ))}
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, paddingTop: 8 }}>
                <span style={{ fontSize: 14, fontWeight: 600 }}>Total</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: 'var(--accent)', fontFamily: 'var(--font-head)' }}>
                  R$ {totalDetalhe.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}