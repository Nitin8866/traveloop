import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { CheckSquare, Square, Plus, DollarSign, PieChart, Tag, Trash2, Briefcase } from 'lucide-react';

const TripUtilities = () => {
    const { tripId } = useParams();
    const [activeTab, setActiveTab] = useState('checklist');
    const [checklist, setChecklist] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [newExpense, setNewExpense] = useState({ category: 'Transport', description: '', amount: '', date: new Date().toISOString().split('T')[0] });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const checklistRes = await axios.get(`/api/utility/checklist/${tripId}`, { headers });
        const expensesRes = await axios.get(`/api/utility/expenses/${tripId}`, { headers });
        setChecklist(checklistRes.data);
        setExpenses(expensesRes.data);
    };

    useEffect(() => {
        fetchData();
    }, [tripId]);

    const handleAddItem = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/api/utility/checklist', { tripId, itemName: newItem, category: 'General' }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewItem('');
        fetchData();
    };

    const toggleItem = async (id, currentStatus) => {
        const token = localStorage.getItem('token');
        await axios.put(`/api/utility/checklist/${id}`, { isPacked: !currentStatus }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        fetchData();
    };

    const handleAddExpense = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/api/utility/expenses', { ...newExpense, tripId }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setNewExpense({ category: 'Transport', description: '', amount: '', date: new Date().toISOString().split('T')[0] });
        fetchData();
    };

    const totalBudget = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount), 0);

    return (
        <div style={{ padding: '4rem 10%', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem' }}>Trip Planner Tools</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your budget and packing list</p>
                </div>
                <Link to={`/itinerary/${tripId}`} className="btn-primary" style={{ textDecoration: 'none', background: '#eee', color: 'var(--primary)' }}>View Itinerary</Link>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '3rem', borderBottom: '1px solid #eee' }}>
                <button onClick={() => setActiveTab('checklist')} style={{ padding: '1rem 0', borderBottom: activeTab === 'checklist' ? '3px solid var(--primary)' : 'none', color: activeTab === 'checklist' ? 'var(--primary)' : '#999', fontWeight: 600, background: 'none' }}>Packing Checklist</button>
                <button onClick={() => setActiveTab('expenses')} style={{ padding: '1rem 0', borderBottom: activeTab === 'expenses' ? '3px solid var(--primary)' : 'none', color: activeTab === 'expenses' ? 'var(--primary)' : '#999', fontWeight: 600, background: 'none' }}>Expenses & Budget</button>
            </div>

            {activeTab === 'checklist' ? (
                <div className="animate-fade-in">
                    <div className="premium-card" style={{ maxWidth: '600px', margin: '0 auto' }}>
                        <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><Briefcase /> Packing List</h3>
                        <form onSubmit={handleAddItem} style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                            <input type="text" placeholder="Add new item (e.g. Passport, Charger)" value={newItem} onChange={e => setNewItem(e.target.value)} style={{ flex: 1, padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} required />
                            <button type="submit" className="btn-primary"><Plus size={18} /></button>
                        </form>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            {checklist.map(item => (
                                <div key={item.id} onClick={() => toggleItem(item.id, item.is_packed)} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1rem', background: item.is_packed ? '#f0fdf4' : '#f8f9fa', borderRadius: '10px', cursor: 'pointer', transition: '0.3s' }}>
                                    {item.is_packed ? <CheckSquare color="#22c55e" /> : <Square color="#ccc" />}
                                    <span style={{ textDecoration: item.is_packed ? 'line-through' : 'none', color: item.is_packed ? '#166534' : 'inherit' }}>{item.item_name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="animate-fade-in" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem' }}>
                    {/* Add Expense Form */}
                    <div className="premium-card">
                        <h3 style={{ marginBottom: '1.5rem' }}>Add Expense</h3>
                        <form onSubmit={handleAddExpense} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Category</label>
                                <select style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewExpense({...newExpense, category: e.target.value})}>
                                    <option>Transport</option>
                                    <option>Stay</option>
                                    <option>Food</option>
                                    <option>Activities</option>
                                    <option>Shopping</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Description</label>
                                <input type="text" placeholder="Flight to Paris" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} value={newExpense.description} onChange={e => setNewExpense({...newExpense, description: e.target.value})} required />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '5px', fontSize: '0.9rem' }}>Amount ($)</label>
                                <input type="number" placeholder="0.00" style={{ width: '100%', padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} value={newExpense.amount} onChange={e => setNewExpense({...newExpense, amount: e.target.value})} required />
                            </div>
                            <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>Add to Budget</button>
                        </form>
                    </div>

                    {/* Expense List & Summary */}
                    <div>
                        <div className="premium-card" style={{ background: 'var(--primary)', color: 'white', marginBottom: '2rem', textAlign: 'center' }}>
                            <p style={{ opacity: 0.8, fontSize: '0.9rem' }}>Total Estimated Cost</p>
                            <h2 style={{ color: 'white', fontSize: '3rem', margin: '0.5rem 0' }}>${totalBudget.toFixed(2)}</h2>
                        </div>
                        <div className="premium-card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Expense History</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {expenses.map(exp => (
                                    <div key={exp.id} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid #eee' }}>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{exp.description}</div>
                                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{exp.category} • {new Date(exp.date).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>${exp.amount}</div>
                                    </div>
                                ))}
                                {expenses.length === 0 && <p style={{ textAlign: 'center', color: '#999' }}>No expenses recorded yet.</p>}
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TripUtilities;
