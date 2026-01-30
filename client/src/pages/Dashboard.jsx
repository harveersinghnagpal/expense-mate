import { useEffect, useState } from 'react';
import api from '../services/api';

const Dashboard = () => {
    const [stats, setStats] = useState({ income: 0, expense: 0, savings: 0, savingsPercentage: 0 });
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, insightsRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/insights')
                ]);
                setStats(statsRes.data);
                setInsights(insightsRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px' }}>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>TOTAL INCOME</h3>
                    <p className="font-mono neon-text-blue" style={{ fontSize: '2rem', marginTop: '8px' }}>
                        ${stats.income.toLocaleString()}
                    </p>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>TOTAL EXPENSE</h3>
                    <p className="font-mono neon-text-red" style={{ fontSize: '2rem', marginTop: '8px' }}>
                        ${stats.expense.toLocaleString()}
                    </p>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>SAVINGS</h3>
                    <p className="font-mono neon-text-green" style={{ fontSize: '2rem', marginTop: '8px' }}>
                        ${stats.savings.toLocaleString()}
                    </p>
                </div>
                <div className="card" style={{ padding: '24px' }}>
                    <h3 style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>SAVINGS RATE</h3>
                    <p className="font-mono neon-text-purple" style={{ fontSize: '2rem', marginTop: '8px' }}>
                        {stats.savingsPercentage}%
                    </p>
                </div>
            </div>

            <h2 style={{ margin: '40px 0 24px' }}>AI Insights (Rule-Based)</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {insights.length === 0 ? (
                    <div className="card" style={{ padding: '24px', gridColumn: 'span 2', color: 'var(--text-secondary)' }}>
                        No insights available yet. Add more transactions.
                    </div>
                ) : (
                    insights.map((insight, index) => (
                        <div key={index} className="card" style={{ padding: '24px', borderLeft: `4px solid ${insight.type === 'warning' ? 'var(--neon-red)' : 'var(--neon-blue)'}` }}>
                            <h3 style={{ fontSize: '1.1rem', marginBottom: '8px' }}>{insight.title}</h3>
                            <p style={{ color: 'var(--text-secondary)' }}>{insight.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};


export default Dashboard;
