import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/layout/Layout';
import { Calendar, Image as ImageIcon, ArrowRight, Sparkles } from 'lucide-react';

const CreateTrip = () => {
    const [formData, setFormData] = useState({
        name: '', description: '', startDate: '', endDate: '', coverPhoto: ''
    });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/trips', formData, {
                headers: { Authorization: `Bearer ${token}` }
            });
            navigate('/my-trips');
        } catch (error) {
            alert('Error creating trip');
        }
    };

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>Create a New Journey</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Fill in the details to start planning your perfect multi-city trip.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '3rem' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="premium-card">
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Journey Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. European Summer Dreams" 
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', fontSize: '1rem' }}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Departure Date</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Return Date</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Trip Inspiration (Description)</label>
                                    <textarea placeholder="Tell us about your goals for this trip..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', minHeight: '120px', resize: 'none' }} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Cover Image URL</label>
                                    <input type="text" placeholder="https://unsplash.com/..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, coverPhoto: e.target.value})} />
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '12px', borderRadius: '16px' }}>
                            Initialize Journey <ArrowRight size={20} />
                        </button>
                    </form>

                    <aside>
                        <div className="premium-card" style={{ position: 'sticky', top: '2rem', padding: '1.5rem' }}>
                            <h4 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '8px' }}><Sparkles size={18} color="var(--secondary)" /> Live Preview</h4>
                            <div style={{ borderRadius: '16px', overflow: 'hidden', height: '180px', background: '#f0f2f5', marginBottom: '1.5rem' }}>
                                {formData.coverPhoto ? <img src={formData.coverPhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#aaa' }}>No image provided</div>}
                            </div>
                            <h3 style={{ marginBottom: '0.5rem' }}>{formData.name || 'Your Epic Journey'}</h3>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                                <Calendar size={14} /> {formData.startDate || 'Start'} — {formData.endDate || 'End'}
                            </div>
                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: 1.5 }}>{formData.description || 'Provide a description to see it here...'}</p>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default CreateTrip;
