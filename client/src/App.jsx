import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext, { AuthProvider } from './context/AuthContext';
import Layout from './components/layout/Layout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Budgets from './pages/Budgets';
import Insights from './pages/Insights';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ color: 'var(--neon-green)', padding: '40px' }}>System Initializing...</div>;

  return user ? <Layout>{children}</Layout> : <Navigate to="/auth" />;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
          <Route path="/transactions" element={<PrivateRoute><Transactions /></PrivateRoute>} />
          <Route path="/budgets" element={<PrivateRoute><Budgets /></PrivateRoute>} />
          <Route path="/insights" element={<PrivateRoute><Insights /></PrivateRoute>} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
