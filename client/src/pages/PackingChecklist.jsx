import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    CheckSquare, Square, Plus, Trash2, Tag, 
    Smartphone, FileText, Briefcase, Shirt, ArrowLeft, Loader2 
} from 'lucide-react';

const PackingChecklist = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [newItem, setNewItem] = useState('');
    const [category, setCategory] = useState('Clothing');
    const [loading, setLoading] = useState(true);

    const categories = [
        { name: 'Clothing', icon: <Shirt size={18} /> },
        { name: 'Electronics', icon: <Smartphone size={18} /> },
        { name: 'Documents', icon: <FileText size={18} /> },
        { name: 'Toiletries', icon: <Briefcase size={18} /> },
        { name: 'Other', icon: <Tag size={18} /> },
    ];

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get(`/api/packing/${tripId}`, { headers: { Authorization: `Bearer ${token}` } });
                setItems(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchItems();
    }, [tripId]);

    const addItem = async (e) => {
        e.preventDefault();
        if (!newItem) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/packing', { tripId, itemName: newItem, category }, { headers: { Authorization: `Bearer ${token}` } });
            setItems([...items, { ...res.data, is_packed: 0 }]);
            setNewItem('');
        } catch (err) { console.error(err); }
    };

    const togglePacked = async (id, current) => {
        try {
            const token = localStorage.getItem('token');
            await axios.patch(`/api/packing/${id}`, { isPacked: !current }, { headers: { Authorization: `Bearer ${token}` } });
            setItems(items.map(item => item.id === id ? { ...item, is_packed: !current } : item));
        } catch (err) { console.error(err); }
    };

    const deleteItem = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/packing/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setItems(items.filter(item => item.id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Preparing checklist...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon" style={{ background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-2px' }}>Packing Checklist</h1>
                </div>

                <form onSubmit={addItem} className="premium-card" style={{ padding: '2.5rem', background: 'white', marginBottom: '3rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                    <input 
                        type="text" placeholder="Add an item (e.g. Passport, Charger)" 
                        value={newItem} onChange={(e) => setNewItem(e.target.value)}
                        style={{ flex: 1, padding: '1.2rem', borderRadius: '15px', border: '2px solid #F1F5F9', fontWeight: 600 }}
                    />
                    <select 
                        value={category} onChange={(e) => setCategory(e.target.value)}
                        style={{ padding: '1.2rem', borderRadius: '15px', border: '2px solid #F1F5F9', fontWeight: 600, background: 'white' }}
                    >
                        {categories.map(cat => <option key={cat.name} value={cat.name}>{cat.name}</option>)}
                    </select>
                    <button type="submit" className="btn-primary" style={{ padding: '1.2rem 2.5rem', borderRadius: '15px' }}>
                        <Plus size={20} /> Add
                    </button>
                </form>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
                    {categories.map(cat => {
                        const catItems = items.filter(i => i.category === cat.name);
                        if (catItems.length === 0) return null;
                        return (
                            <div key={cat.name}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem', color: '#64748B' }}>
                                    {cat.icon}
                                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '1px' }}>{cat.name}</h3>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {catItems.map(item => (
                                        <div key={item.id} className="premium-card" style={{ padding: '1.2rem 2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: item.is_packed ? '#F8FAFC' : 'white', opacity: item.is_packed ? 0.7 : 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', cursor: 'pointer' }} onClick={() => togglePacked(item.id, item.is_packed)}>
                                                {item.is_packed ? <CheckSquare size={24} color="var(--primary)" /> : <Square size={24} color="#CBD5E1" />}
                                                <span style={{ fontSize: '1.1rem', fontWeight: 700, textDecoration: item.is_packed ? 'line-through' : 'none' }}>{item.item_name}</span>
                                            </div>
                                            <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: '#FDA4AF', cursor: 'pointer' }}><Trash2 size={20} /></button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                    {items.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed #E2E8F0', borderRadius: '32px', color: '#94A3B8' }}>
                            <CheckSquare size={48} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Your checklist is empty</h3>
                            <p>Add items above to start organizing for your trip.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .btn-icon:hover { background: #E2E8F0 !important; transform: scale(1.05); transition: all 0.2s; }
            `}</style>
        </Layout>
    );
};

export default PackingChecklist;
