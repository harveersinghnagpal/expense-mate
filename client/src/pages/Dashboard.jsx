import { useEffect, useState } from 'react';
import api from '../services/api';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';

const Dashboard = () => {
    const [stats, setStats] = useState({ income: 0, expense: 0, savings: 0, savingsPercentage: 0 });
    const [insights, setInsights] = useState([]);
    const [breakdown, setBreakdown] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [statsRes, insightsRes, breakdownRes] = await Promise.all([
                    api.get('/analytics/overview'),
                    api.get('/analytics/insights'),
                    api.get('/analytics/category-breakdown')
                ]);
                setStats(statsRes.data);
                setInsights(insightsRes.data);
                setBreakdown(breakdownRes.data);
            } catch (error) {
                console.error("Failed to fetch data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) return <div style={{ color: 'var(--text-secondary)' }}>Loading...</div>;

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF4D6D', '#9B5CFF'];

    return (
        <div>
            <h1 style={{ marginBottom: '24px' }}>Dashboard</h1>

            {/* Top Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '24px', marginBottom: '32px' }}>
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

            {/* Charts Section */}
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
                <div className="card" style={{ padding: '24px', height: '400px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Spending Breakdown</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={breakdown}>
                            <XAxis dataKey="_id" stroke="#52525B" tick={{ fill: '#A0A0A0' }} />
                            <YAxis stroke="#52525B" tick={{ fill: '#A0A0A0' }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#16161F', border: '1px solid #333', color: '#fff' }}
                                cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                            />
                            <Bar dataKey="total" radius={[4, 4, 0, 0]}>
                                {breakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                <div className="card" style={{ padding: '24px', height: '400px' }}>
                    <h3 style={{ marginBottom: '24px' }}>Distribution</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={breakdown}
                                cx="50%"
                                cy="50%"
                                innerRadius={60}
                                outerRadius={80}
                                paddingAngle={5}
                                dataKey="total"
                                nameKey="_id"
                            >
                                {breakdown.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip contentStyle={{ backgroundColor: '#16161F', border: '1px solid #333' }} />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Insights Section */}
            <h2 style={{ marginBottom: '24px' }}>AI Insights</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {insights.length === 0 ? (
                    <div className="card" style={{ padding: '24px', gridColumn: 'span 2', color: 'var(--text-secondary)' }}>
                        No insights available yet. Add more transactions to generate intelligence.
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
