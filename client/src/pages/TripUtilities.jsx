import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { CheckSquare, Square, Plus, DollarSign, FileText, Briefcase, Smartphone, MoreHorizontal, Share2 } from 'lucide-react';

const TripUtilities = () => {
    const { tripId } = useParams();
    const [activeTab, setActiveTab] = useState('checklist');
    const [checklist, setChecklist] = useState([]);
    const [expenses, setExpenses] = useState([]);
    const [newItem, setNewItem] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const checkRes = await axios.get(`/api/utility/checklist/${tripId}`, { headers });
            const expRes = await axios.get(`/api/utility/expenses/${tripId}`, { headers });
            setChecklist(checkRes.data);
            setExpenses(expRes.data);
        };
        fetchData();
    }, [tripId]);

    const toggleItem = async (id, status) => {
        const token = localStorage.getItem('token');
        await axios.put(`/api/utility/checklist/${id}`, { isPacked: !status }, { headers: { Authorization: `Bearer ${token}` } });
        setChecklist(checklist.map(item => item.id === id ? { ...item, is_packed: !status } : item));
    };

    const packedCount = checklist.filter(i => i.is_packed).length;
    const totalCount = checklist.length;
    const progress = totalCount > 0 ? (packedCount / totalCount) * 100 : 0;

    const sections = [
        { title: 'Documents', icon: <FileText size={18} />, items: checklist.filter(i => i.category === 'Documents') },
        { title: 'Clothing', icon: <Briefcase size={18} />, items: checklist.filter(i => i.category === 'Clothing') },
        { title: 'Electronics', icon: <Smartphone size={18} />, items: checklist.filter(i => i.category === 'Electronics') },
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Packing Checklist</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Don't leave home without these essentials.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}><Share2 size={18} /> Share</button>
                        <button className="btn-primary" onClick={() => setActiveTab(activeTab === 'checklist' ? 'budget' : 'checklist')}>
                            {activeTab === 'checklist' ? 'View Budget' : 'View Checklist'}
                        </button>
                    </div>
                </div>

                {/* Progress Card (Matches Wireframe) */}
                <div className="premium-card" style={{ marginBottom: '3rem', padding: '2rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                        <h4 style={{ fontWeight: 800 }}>Trip Progress</h4>
                        <span style={{ fontWeight: 800, color: 'var(--primary)' }}>{packedCount}/{totalCount} Items Packed</span>
                    </div>
                    <div style={{ width: '100%', height: '12px', background: '#F3F4F6', borderRadius: '10px', overflow: 'hidden' }}>
                        <div style={{ width: `${progress}%`, height: '100%', background: 'var(--primary-gradient)', transition: 'width 0.5s ease' }}></div>
                    </div>
                </div>

                {/* Grouped Sections (Matches Wireframe) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {sections.map((section, i) => (
                        <div key={i}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.5rem', borderBottom: '1px solid #eee', paddingBottom: '0.8rem' }}>
                                <div style={{ color: 'var(--primary)' }}>{section.icon}</div>
                                <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{section.title}</h3>
                                <span style={{ fontSize: '0.8rem', color: '#9CA3AF', marginLeft: 'auto' }}>{section.items.length} items</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                                {section.items.map(item => (
                                    <div key={item.id} onClick={() => toggleItem(item.id, item.is_packed)} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '1.2rem', background: 'white', border: '1px solid #F3F4F6', borderRadius: '16px', cursor: 'pointer', transition: '0.2s' }}>
                                        {item.is_packed ? <CheckSquare color="var(--accent)" /> : <Square color="#D1D5DB" />}
                                        <span style={{ flex: 1, fontWeight: 600, color: item.is_packed ? '#9CA3AF' : 'var(--text-main)', textDecoration: item.is_packed ? 'line-through' : 'none' }}>{item.item_name}</span>
                                        <button style={{ background: 'none', border: 'none', color: '#D1D5DB' }}><MoreHorizontal size={18} /></button>
                                    </div>
                                ))}
                                {section.items.length === 0 && <p style={{ color: '#9CA3AF', fontSize: '0.9rem', paddingLeft: '1rem' }}>No items in this category.</p>}
                            </div>
                        </div>
                    ))}
                    
                    <button className="premium-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', border: '2px dashed #eee', color: '#9CA3AF', fontWeight: 700, padding: '1.5rem', cursor: 'pointer' }}>
                        <Plus size={20} /> Add item to checklist
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default TripUtilities;
