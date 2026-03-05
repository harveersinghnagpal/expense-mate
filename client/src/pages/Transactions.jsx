import { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Filter, Search } from 'lucide-react';

const Transactions = () => {
    const [transactions, setTransactions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        type: 'expense',
        amount: '',
        categoryId: '',
        note: '',
        date: new Date().toISOString().split('T')[0]
    });

    useEffect(() => {
        fetchData();
        fetchCategories();
    }, []);

    const fetchData = async () => {
        try {
            const { data } = await api.get('/transactions');
            setTransactions(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const { data } = await api.get('/categories');
            setCategories(data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (id) => {
        if (confirm('Are you sure?')) {
            try {
                await api.delete(`/transactions/${id}`);
                setTransactions(transactions.filter(t => t._id !== id));
            } catch (error) {
                console.error(error);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.post('/transactions', formData);
            setShowModal(false);
            setFormData({
                type: 'expense',
                amount: '',
                categoryId: '',
                note: '',
                date: new Date().toISOString().split('T')[0]
            });
            fetchData();
        } catch (error) {
            console.error(error);
            alert('Error adding transaction');
        }
    };

    // Initialize default categories if none exist (Quick fix for MVP UX)
    const initCategories = async () => {
        const defaults = [
            { name: 'Food', color: '#FF4D6D', icon: 'coffee' },
            { name: 'Transport', color: '#3CF2FF', icon: 'car' },
            { name: 'Salary', color: '#00F5A0', icon: 'dollar-sign' },
            { name: 'Utilities', color: '#9B5CFF', icon: 'zap' },
        ];
        for (const cat of defaults) {
            await api.post('/categories', cat);
        }
        fetchCategories();
    }

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Transactions</h1>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={20} style={{ marginRight: '8px' }} />
                    Add Transaction
                </button>
            </div>

            {categories.length === 0 && (
                <div style={{ marginBottom: '20px', padding: '16px', border: '1px solid var(--neon-blue)', borderRadius: '8px', color: 'var(--neon-blue)' }}>
                    No categories found.
                    <button onClick={initCategories} style={{ marginLeft: '10px', textDecoration: 'underline', background: 'none', color: 'inherit', cursor: 'pointer' }}>
                        Click to generate defaults
                    </button>
                </div>
            )}

            <div className="card" style={{ overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', color: 'var(--text-secondary)' }}>
                            <th style={{ padding: '16px' }}>Date</th>
                            <th style={{ padding: '16px' }}>Category</th>
                            <th style={{ padding: '16px' }}>Note</th>
                            <th style={{ padding: '16px' }}>Amount</th>
                            <th style={{ padding: '16px' }}>Type</th>
                            <th style={{ padding: '16px' }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {transactions.map((t) => (
                            <tr key={t._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                                <td style={{ padding: '16px' }}>{new Date(t.date).toLocaleDateString()}</td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{
                                        display: 'inline-block',
                                        padding: '4px 8px',
                                        borderRadius: '4px',
                                        backgroundColor: `${t.categoryId?.color || '#333'}20`,
                                        color: t.categoryId?.color || '#fff',
                                        border: `1px solid ${t.categoryId?.color || '#333'}`
                                    }}>
                                        {t.categoryId?.name || 'Uncategorized'}
                                    </span>
                                </td>
                                <td style={{ padding: '16px', color: 'var(--text-secondary)' }}>{t.note || '-'}</td>
                                <td className="font-mono" style={{ padding: '16px', fontSize: '1.1rem' }}>
                                    ${t.amount.toLocaleString()}
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <span style={{ color: t.type === 'income' ? 'var(--neon-green)' : 'var(--neon-red)' }}>
                                        {t.type.toUpperCase()}
                                    </span>
                                </td>
                                <td style={{ padding: '16px' }}>
                                    <button onClick={() => handleDelete(t._id)} style={{ color: 'var(--text-muted)', background: 'none' }}>
                                        <Trash2 size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                        {transactions.length === 0 && (
                            <tr>
                                <td colSpan="6" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
                                    No transactions recorded.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '500px', padding: '32px' }}>
                        <h2 style={{ marginBottom: '24px' }}>New Transaction</h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                                <select
                                    value={formData.type}
                                    onChange={e => setFormData({ ...formData, type: e.target.value })}
                                >
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                                <input
                                    type="date"
                                    value={formData.date}
                                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>

                            <input
                                type="number"
                                placeholder="Amount"
                                value={formData.amount}
                                onChange={e => setFormData({ ...formData, amount: e.target.value })}
                                required
                            />

                            <select
                                value={formData.categoryId}
                                onChange={e => setFormData({ ...formData, categoryId: e.target.value })}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <input
                                type="text"
                                placeholder="Note (optional)"
                                value={formData.note}
                                onChange={e => setFormData({ ...formData, note: e.target.value })}
                            />

                            <div style={{ display: 'flex', gap: '16px', marginTop: '16px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save</button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Transactions;
