import { useEffect, useContext } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const AuthSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { loginWithToken } = useContext(AuthContext);

    useEffect(() => {
        const token = searchParams.get('token');
        if (token) {
            localStorage.setItem('token', token);
            // Optionally call a method to immediately update the context
            if (loginWithToken) {
                loginWithToken(token);
            }
            navigate('/dashboard');
        } else {
            navigate('/auth');
        }
    }, [searchParams, navigate, loginWithToken]);

    return (
        <div className="min-h-screen bg-[#0B0B0E] flex items-center justify-center">
            <div className="text-center">
                <div className="w-16 h-16 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-slate-400 font-mono">AUTHENTICATING_SESSION...</p>
            </div>
        </div>
    );
};

export default AuthSuccess;
