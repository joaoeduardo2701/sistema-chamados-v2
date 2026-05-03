import { NavLink, Outlet } from 'react-router-dom';

const links = [
  { to: '/', label: 'Dashboard', icon: '▦' },
  { to: '/clientes', label: 'Clientes', icon: '◉' },
  { to: '/produtos', label: 'Produtos', icon: '◈' },
  { to: '/pedidos', label: 'Pedidos', icon: '◎' },
];

export default function Layout() {
  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{
        width: 220, background: 'var(--surface)', borderRight: '1px solid var(--border)',
        display: 'flex', flexDirection: 'column', padding: '2rem 0', position: 'sticky',
        top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 1.5rem 2rem', borderBottom: '1px solid var(--border)' }}>
          <h1 style={{
            fontFamily: 'var(--font-head)', fontSize: 18, fontWeight: 800,
            letterSpacing: '-0.5px', color: 'var(--accent)',
          }}>PEDIDOS<span style={{ color: 'var(--accent2)' }}>SYS</span></h1>
          <p style={{ fontSize: 11, color: 'var(--muted)', marginTop: 2 }}>Sistema de Pedidos</p>
        </div>

        <nav style={{ flex: 1, padding: '1.5rem 0' }}>
          {links.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              style={({ isActive }) => ({
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 1.5rem', fontSize: 13, fontWeight: 500,
                textDecoration: 'none', transition: 'all 0.15s',
                color: isActive ? 'var(--accent)' : 'var(--muted)',
                background: isActive ? 'rgba(240,193,75,0.08)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
              })}>
              <span style={{ fontSize: 16 }}>{icon}</span> {label}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding: '1rem 1.5rem', borderTop: '1px solid var(--border)' }}>
          <p style={{ fontSize: 11, color: 'var(--muted)' }}>Restaurante Demo v1.0</p>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '2.5rem', overflowY: 'auto' }}>
        <Outlet />
      </main>
    </div>
  );
}