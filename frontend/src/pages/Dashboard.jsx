import { useEffect, useState } from 'react';
import api from '../api/api';

const StatusBadge = ({ s }) => {
  const map = { pendente: ['#e0a832','#2a2010'], aprovado: ['#4caf84','#0e2018'], cancelado: ['#e05c5c','#2a0e0e'] };
  const [color, bg] = map[s] || ['#888','#1a1a1a'];
  return (
    <span style={{
      background: bg, color, fontSize: 11, fontWeight: 600,
      padding: '3px 10px', borderRadius: 20, textTransform: 'uppercase', letterSpacing: 1,
    }}>{s}</span>
  );
};

export default function Dashboard() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);

  useEffect(() => {
    Promise.all([
      api.get('/pedidos'), api.get('/clientes'), api.get('/produtos')
    ]).then(([p, c, pr]) => {
      setPedidos(p.data); setClientes(c.data); setProdutos(pr.data);
    });
  }, []);

  const counts = {
    pendente: pedidos.filter(p => p.Status === 'pendente').length,
    aprovado: pedidos.filter(p => p.Status === 'aprovado').length,
    cancelado: pedidos.filter(p => p.Status === 'cancelado').length,
  };

  const card = (label, value, color) => (
    <div style={{
      background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)',
      padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: 6,
    }}>
      <span style={{ fontSize: 12, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 1 }}>{label}</span>
      <span style={{ fontSize: 32, fontFamily: 'var(--font-head)', fontWeight: 800, color }}>{value}</span>
    </div>
  );

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontFamily: 'var(--font-head)', fontSize: 28, fontWeight: 800, letterSpacing: '-1px' }}>
          Visão Geral
        </h2>
        <p style={{ color: 'var(--muted)', marginTop: 4 }}>Resumo do sistema de pedidos</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: 16, marginBottom: '2.5rem' }}>
        {card('Total Pedidos', pedidos.length, 'var(--text)')}
        {card('Pendentes', counts.pendente, 'var(--warning)')}
        {card('Aprovados', counts.aprovado, 'var(--success)')}
        {card('Cancelados', counts.cancelado, 'var(--danger)')}
        {card('Clientes', clientes.length, 'var(--accent)')}
        {card('Produtos', produtos.length, 'var(--accent2)')}
      </div>

      <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
        <h3 style={{ fontFamily: 'var(--font-head)', fontSize: 16, fontWeight: 700, marginBottom: '1rem' }}>
          Últimos Pedidos
        </h3>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border)' }}>
              {['#','Cliente','Mesa','Data','Status'].map(h => (
                <th key={h} style={{ textAlign: 'left', padding: '8px 12px', color: 'var(--muted)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {pedidos.slice(0, 8).map(p => (
              <tr key={p.Id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>#{p.Id}</td>
                <td style={{ padding: '10px 12px', fontWeight: 500 }}>{p.Cliente}</td>
                <td style={{ padding: '10px 12px' }}>Mesa {p.NumeroMesa}</td>
                <td style={{ padding: '10px 12px', color: 'var(--muted)' }}>
                  {new Date(p.Data).toLocaleString('pt-BR')}
                </td>
                <td style={{ padding: '10px 12px' }}><StatusBadge s={p.Status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}