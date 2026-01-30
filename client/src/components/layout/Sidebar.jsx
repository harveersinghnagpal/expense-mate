import { Home, CreditCard, PieChart, BarChart2, LogOut } from 'lucide-react';
import { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';

const Sidebar = () => {
    const { logout } = useContext(AuthContext);

    const navItems = [
        { icon: Home, label: 'Dashboard', path: '/' },
        { icon: CreditCard, label: 'Transactions', path: '/transactions' },
        { icon: PieChart, label: 'Budgets', path: '/budgets' },
        { icon: BarChart2, label: 'Insights', path: '/insights' },
    ];

    return (
        <div style={{
            width: '240px',
            height: '100vh',
            backgroundColor: 'var(--bg-card)',
            borderRight: '1px solid rgba(255,255,255,0.05)',
            display: 'flex',
            flexDirection: 'column',
            padding: 'var(--spacing-md)',
            position: 'fixed',
            left: 0,
            top: 0
        }}>
            <div style={{ marginBottom: '40px', padding: '0 12px' }}>
                <h1 style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>
                    <span className="neon-text-green">FIN</span>Terminal
                </h1>
            </div>

            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {navItems.map((item) => (
                    <NavLink
                        key={item.path}
                        to={item.path}
                        style={({ isActive }) => ({
                            display: 'flex',
                            alignItems: 'center',
                            padding: '12px',
                            borderRadius: '8px',
                            color: isActive ? 'var(--neon-green)' : 'var(--text-secondary)',
                            backgroundColor: isActive ? 'rgba(0, 245, 160, 0.05)' : 'transparent',
                            transition: 'all 0.2s',
                            gap: '12px'
                        })}
                    >
                        <item.icon size={20} />
                        <span style={{ fontWeight: 500 }}>{item.label}</span>
                    </NavLink>
                ))}
            </nav>

            <button
                onClick={logout}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '12px',
                    color: 'var(--neon-red)',
                    background: 'none',
                    border: 'none',
                    marginTop: 'auto',
                    cursor: 'pointer',
                    borderRadius: '8px',
                    transition: 'background 0.2s'
                }}
                onMouseEnter={(e) => e.target.style.background = 'rgba(255, 77, 109, 0.05)'}
                onMouseLeave={(e) => e.target.style.background = 'transparent'}
            >
                <LogOut size={20} />
                <span>Logout</span>
            </button>
        </div>
    );
};

export default Sidebar;
