import { useState, useEffect } from 'react';
import api from '../services/api';
import { Target, AlertTriangle, Pencil, Trash2 } from 'lucide-react';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [spending, setSpending] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingBudget, setEditingBudget] = useState(null);

    const defaultForm = {
        categoryId: '',
        limitAmount: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear()
    };

    const [form, setForm] = useState(defaultForm);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        const [budgetsRes, catsRes, breakdownRes] = await Promise.all([
            api.get('/budgets'),
            api.get('/categories'),
            api.get('/analytics/category-breakdown')
        ]);
        setBudgets(budgetsRes.data);
        setCategories(catsRes.data);
        setSpending(breakdownRes.data);
    };

    const openCreateModal = () => {
        setEditingBudget(null);
        setForm(defaultForm);
        setShowModal(true);
    };

    const openEditModal = (budget) => {
        setEditingBudget(budget);
        setForm({
            categoryId: budget.categoryId?._id || '',
            limitAmount: budget.limitAmount,
            month: budget.month,
            year: budget.year
        });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setEditingBudget(null);
        setForm(defaultForm);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingBudget) {
                await api.put(`/budgets/${editingBudget._id}`, form);
            } else {
                await api.post('/budgets', form);
            }
            closeModal();
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDelete = async (budget) => {
        if (!window.confirm(`Delete the budget for "${budget.categoryId?.name}"?`)) return;
        try {
            await api.delete(`/budgets/${budget._id}`);
            loadData();
        } catch (error) {
            console.error(error);
        }
    };

    const getSpendForCategory = (catName) => {
        const found = spending.find(s => s._id === catName);
        return found ? found.total : 0;
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1>Monthly Budgets</h1>
                <button className="btn btn-primary" onClick={openCreateModal}>
                    <Target size={20} style={{ marginRight: '8px' }} />
                    Set Budget
                </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '24px' }}>
                {budgets.map(b => {
                    const spent = getSpendForCategory(b.categoryId?.name);
                    const percentage = Math.min((spent / b.limitAmount) * 100, 100);
                    const isOver = spent > b.limitAmount;

                    return (
                        <div key={b._id} className="card" style={{ padding: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                <h3 style={{ color: b.categoryId?.color }}>{b.categoryId?.name}</h3>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span className="font-mono">
                                        ${spent.toLocaleString()} / <span style={{ color: 'var(--text-secondary)' }}>${b.limitAmount.toLocaleString()}</span>
                                    </span>
                                    <button
                                        onClick={() => openEditModal(b)}
                                        title="Edit budget"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--text-secondary)', padding: '4px',
                                            borderRadius: '4px', display: 'flex', alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-blue)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        <Pencil size={16} />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(b)}
                                        title="Delete budget"
                                        style={{
                                            background: 'none', border: 'none', cursor: 'pointer',
                                            color: 'var(--text-secondary)', padding: '4px',
                                            borderRadius: '4px', display: 'flex', alignItems: 'center',
                                            transition: 'color 0.2s'
                                        }}
                                        onMouseEnter={e => e.currentTarget.style.color = 'var(--neon-red)'}
                                        onMouseLeave={e => e.currentTarget.style.color = 'var(--text-secondary)'}
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>

                            <div style={{ height: '8px', backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
                                <div style={{
                                    width: `${percentage}%`,
                                    height: '100%',
                                    backgroundColor: isOver ? 'var(--neon-red)' : b.categoryId?.color || 'var(--neon-blue)',
                                    transition: 'width 1s ease-in-out'
                                }} />
                            </div>

                            {isOver && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: 'var(--neon-red)', fontSize: '0.9rem' }}>
                                    <AlertTriangle size={16} />
                                    <span>Budget exceeded by ${(spent - b.limitAmount).toLocaleString()}</span>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            {showModal && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0,0,0,0.8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div className="card" style={{ width: '400px', padding: '32px' }}>
                        <h2 style={{ marginBottom: '24px' }}>
                            {editingBudget ? 'Edit Budget Limit' : 'Set Budget Limit'}
                        </h2>
                        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                            <select
                                value={form.categoryId}
                                onChange={e => setForm({ ...form, categoryId: e.target.value })}
                                required
                                disabled={!!editingBudget}
                                style={editingBudget ? { opacity: 0.6, cursor: 'not-allowed' } : {}}
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c._id} value={c._id}>{c.name}</option>
                                ))}
                            </select>

                            <input
                                type="number"
                                placeholder="Monthly Limit ($)"
                                value={form.limitAmount}
                                onChange={e => setForm({ ...form, limitAmount: e.target.value })}
                                required
                            />

                            <div style={{ display: 'flex', gap: '16px' }}>
                                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>
                                    {editingBudget ? 'Update' : 'Save'}
                                </button>
                                <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={closeModal}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};
export default Budgets;
