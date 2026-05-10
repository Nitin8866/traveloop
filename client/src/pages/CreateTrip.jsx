import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Image as ImageIcon, CheckCircle, ArrowRight } from 'lucide-react';

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
        <div style={{ padding: '4rem 10%', minHeight: '100vh' }}>
            <div style={{ display: 'flex', gap: '4rem' }}>
                {/* Form Section */}
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Start a New Journey</h1>
                    <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Give your trip a name and dates. You'll add cities and activities in the next step.</p>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        <div className="premium-card">
                            <h3 style={{ marginBottom: '1.5rem' }}>Trip Details</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Trip Name</label>
                                    <input 
                                        type="text" 
                                        placeholder="e.g. Summer in Europe" 
                                        style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        required
                                    />
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Start Date</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, startDate: e.target.value})} required />
                                    </div>
                                    <div>
                                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>End Date</label>
                                        <input type="date" style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, endDate: e.target.value})} required />
                                    </div>
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Description</label>
                                    <textarea placeholder="Describe your dream trip..." style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', minHeight: '100px' }} onChange={(e) => setFormData({...formData, description: e.target.value})} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600 }}>Cover Photo URL</label>
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <input type="text" placeholder="https://images.unsplash.com/..." style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, coverPhoto: e.target.value})} />
                                        <button type="button" style={{ padding: '0 1.5rem', borderRadius: '12px', background: '#eee' }}><ImageIcon size={20} /></button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1.2rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px' }}>
                            Save & Continue <ArrowRight size={20} />
                        </button>
                    </form>
                </div>

                {/* Preview Section */}
                <div style={{ flex: 0.8 }}>
                    <div className="premium-card" style={{ position: 'sticky', top: '100px' }}>
                        <h3 style={{ marginBottom: '1.5rem' }}>Trip Preview</h3>
                        <div style={{ borderRadius: '16px', overflow: 'hidden', height: '200px', background: '#eee', marginBottom: '1.5rem' }}>
                            {formData.coverPhoto ? <img src={formData.coverPhoto} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#999' }}>No Image Selected</div>}
                        </div>
                        <h2 style={{ marginBottom: '0.5rem' }}>{formData.name || 'Your Trip Name'}</h2>
                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {formData.startDate || 'Start'} - {formData.endDate || 'End'}</span>
                        </div>
                        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{formData.description || 'Description will appear here...'}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateTrip;
