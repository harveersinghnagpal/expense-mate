import { useState, useEffect } from 'react';
import api from '../services/api';

const Insights = () => {
    const [insights, setInsights] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInsights = async () => {
            try {
                const { data } = await api.get('/analytics/insights');
                setInsights(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchInsights();
    }, []);

    if (loading) return <div>Loading Intelligence...</div>;

    return (
        <div>
            <h1 style={{ marginBottom: '32px' }}>Spending Intelligence</h1>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                {insights.length === 0 ? (
                    <div className="card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        Your financial data model is building. Add more transactions to unlock insights.
                    </div>
                ) : (
                    insights.map((insight, index) => (
                        <div key={index} className="card" style={{
                            padding: '32px',
                            borderLeft: `6px solid ${insight.type === 'warning' ? 'var(--neon-red)' : 'var(--neon-green)'}`,
                            background: `linear-gradient(90deg, ${insight.type === 'warning' ? 'rgba(255, 77, 109, 0.05)' : 'rgba(0, 245, 160, 0.05)'} 0%, transparent 100%)`
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                                <h3 style={{ fontSize: '1.25rem' }}>{insight.title}</h3>
                                <span style={{
                                    padding: '4px 12px',
                                    borderRadius: '16px',
                                    fontSize: '0.8rem',
                                    border: `1px solid ${insight.type === 'warning' ? 'var(--neon-red)' : 'var(--neon-green)'}`,
                                    color: insight.type === 'warning' ? 'var(--neon-red)' : 'var(--neon-green)'
                                }}>
                                    {insight.type.toUpperCase()}
                                </span>
                            </div>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: '1.6' }}>{insight.message}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
export default Insights;
