import { useState, useContext, useEffect } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const Auth = () => {
    const location = useLocation();
    const [isLogin, setIsLogin] = useState(location.pathname !== '/signup');
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register, user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        setIsLogin(location.pathname !== '/signup');
    }, [location.pathname]);

    useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/dashboard');
        } catch (err) {
            setError(err.response?.data?.message || 'Something went wrong');
        }
    };

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'radial-gradient(circle at center, #16161F 0%, #0B0B0E 100%)'
        }}>
            <div className="card" style={{ width: '400px', padding: '40px' }}>
                <h2 style={{ marginBottom: '8px', textAlign: 'center', fontSize: '1.5rem' }}>
                    <span className="neon-text-green">FIN</span>Terminal
                </h2>
                <p style={{ textAlign: 'center', color: 'var(--text-secondary)', marginBottom: '32px' }}>
                    {isLogin ? 'Access your command center' : 'Initialize new profile'}
                </p>

                {error && (
                    <div style={{
                        color: 'var(--neon-red)',
                        marginBottom: '16px',
                        textAlign: 'center',
                        background: 'rgba(255, 77, 109, 0.1)',
                        padding: '8px',
                        borderRadius: '4px'
                    }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {!isLogin && (
                        <input
                            type="text"
                            placeholder="Display Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    )}
                    <input
                        type="email"
                        placeholder="ACCESS_ID (Email)"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="SECRET_KEY"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                    />

                    <button type="submit" className="btn btn-primary" style={{ marginTop: '8px' }}>
                        {isLogin ? 'AUTHENTICATE' : 'INITIALIZE'}
                    </button>
                    <button 
                        type="button"
                        onClick={() => window.location.href = `${import.meta.env.VITE_API_URL || 'http://localhost:5000'}/auth/google`}
                        className="btn"
                        style={{ 
                            marginTop: '16px',
                            width: '100%', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '10px',
                            background: 'rgba(255, 255, 255, 0.05)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: 'white'
                        }}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M17.64 9.2c0-.63-.06-1.25-.16-1.84H9v3.49h4.84a4.14 4.14 0 0 1-1.8 2.71v2.26h2.91c1.7-1.56 2.69-3.86 2.69-6.62z"/>
                            <path fill="#34A853" d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.91-2.26c-.8.54-1.83.86-3.05.86-2.34 0-4.33-1.58-5.04-3.71H.95v2.33C2.43 15.98 5.48 18 9 18z"/>
                            <path fill="#FBBC05" d="M3.96 10.71a5.41 5.41 0 0 1 0-3.42V4.96H.95a8.99 8.99 0 0 0 0 8.08l3.01-2.3z"/>
                            <path fill="#EA4335" d="M9 3.58c1.32 0 2.5.45 3.44 1.35L15.02 2.3A8.96 8.96 0 0 0 9 0C5.48 0 2.43 2.02.95 4.96L3.96 7.29C4.67 5.16 6.66 3.58 9 3.58z"/>
                        </svg>
                        Google Authentication
                    </button>
                </form>

                <div style={{ marginTop: '24px', textAlign: 'center' }}>
                    <button
                        onClick={() => setIsLogin(!isLogin)}
                        style={{ background: 'none', color: 'var(--text-secondary)', fontSize: '0.9rem' }}
                    >
                        {isLogin ? 'New user? Initialize protocol' : 'Already have credentials? Authenticate'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Auth;
