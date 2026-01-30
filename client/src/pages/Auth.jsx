import { useState, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Auth = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ name: '', email: '', password: '' });
    const { login, register } = useContext(AuthContext);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            if (isLogin) {
                await login(formData.email, formData.password);
            } else {
                await register(formData.name, formData.email, formData.password);
            }
            navigate('/');
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
