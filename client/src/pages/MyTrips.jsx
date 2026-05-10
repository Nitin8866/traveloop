import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Trash2, Eye, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/trips', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setTrips(res.data);
            setLoading(false);
        } catch (error) {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTrips(); }, []);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            fetchTrips();
        } catch (error) { alert('Error deleting trip'); }
    };

    return (
        <Layout>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Journeys</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage and explore your planned adventures.</p>
                    </div>
                    <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none', borderRadius: '12px' }}>+ Plan New Trip</Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '5rem' }}>Loading your journeys...</div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                        {trips.map(trip => (
                            <div key={trip.id} className="premium-card" style={{ padding: 0, overflow: 'hidden', border: '1px solid #eee' }}>
                                <div style={{ height: '200px', position: 'relative' }}>
                                    <img 
                                        src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'} 
                                        alt={trip.name} 
                                        style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                                    />
                                    <button onClick={() => handleDelete(trip.id)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'white', color: '#e74c3c', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}><Trash2 size={16} /></button>
                                </div>
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.8rem' }}>
                                        <h3 style={{ fontSize: '1.25rem' }}>{trip.name}</h3>
                                        <span style={{ fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '50px', background: '#f0f2f5', color: 'var(--primary)' }}>Multi-city</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.2rem' }}>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Compass size={14} /> View Details</span>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '40px', overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{trip.description || 'No description provided.'}</p>
                                    
                                    <div style={{ display: 'flex', gap: '1rem' }}>
                                        <Link to={`/itinerary/${trip.id}`} style={{ flex: 1, textDecoration: 'none', background: 'var(--primary)', color: 'white', padding: '0.8rem', borderRadius: '10px', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', transition: 'var(--transition)' }}>
                                            <Eye size={18} /> Manage Trip
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && trips.length === 0 && (
                    <div style={{ textAlign: 'center', padding: '6rem 2rem', background: 'white', borderRadius: '32px', boxShadow: 'var(--shadow)' }}>
                        <div style={{ width: '80px', height: '80px', background: '#f8f9fa', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Compass size={40} color="#ccc" />
                        </div>
                        <h3>No journeys planned yet</h3>
                        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Ready to start your first multi-city adventure?</p>
                        <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none' }}>Start Planning Now</Link>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default MyTrips;
