import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Trash2, Eye, Clock, CheckCircle2, SlidersHorizontal, Compass } from 'lucide-react';
import { Link } from 'react-router-dom';

const MyTrips = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchTrips = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } });
            setTrips(res.data);
            setLoading(false);
        } catch (err) { setLoading(false); }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this journey? All planned stops will be lost.')) return;
        
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/trips/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setTrips(trips.filter(t => t.id !== id));
        } catch (err) {
            console.error('Error deleting trip:', err);
            alert('Failed to delete trip.');
        }
    };

    // Categorize trips by date
    const categorizeTrips = (filter) => {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        
        return trips.filter(trip => {
            const start = trip.start_date ? new Date(trip.start_date) : null;
            const end = trip.end_date ? new Date(trip.end_date) : null;
            
            if (!start || !end) return filter === 'upcoming'; // No dates = upcoming
            
            if (filter === 'ongoing') return start <= now && end >= now;
            if (filter === 'upcoming') return start > now;
            if (filter === 'completed') return end < now;
            return false;
        });
    };

    const categories = [
        { title: 'Ongoing', icon: <Clock size={20} color="var(--primary)" />, filter: 'ongoing' },
        { title: 'Up-coming', icon: <Calendar size={20} color="var(--warning)" />, filter: 'upcoming' },
        { title: 'Completed', icon: <CheckCircle2 size={20} color="var(--accent)" />, filter: 'completed' },
    ];

    useEffect(() => { fetchTrips(); }, []);

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>My Journeys</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Keep track of all your global explorations.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                         <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                         <Link to="/create-trip" className="btn-primary">+ New Trip</Link>
                    </div>
                </div>

                {categories.map((cat, i) => {
                    const filteredTrips = categorizeTrips(cat.filter);
                    return (
                        <section key={i} style={{ marginBottom: '4rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                                {cat.icon}
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{cat.title}</h2>
                                <span style={{ background: '#F1F5F9', padding: '2px 12px', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, color: '#64748B' }}>{filteredTrips.length}</span>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {filteredTrips.length > 0 ? (
                                    filteredTrips.map(trip => (
                                        <div key={trip.id} className="premium-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                            <div style={{ width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0 }}>
                                                <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.name} />
                                            </div>
                                            <div style={{ flex: 1 }}>
                                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>{trip.name}</h3>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>{trip.description}</p>
                                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No date'}</span>
                                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {trip.stop_count || 0} Cities</span>
                                                    {trip.destination_place && (
                                                        <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Compass size={14} /> {trip.destination_place.split(',')[0]}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <Link to={`/itinerary-view/${trip.id}`} className="btn-primary" style={{ padding: '10px 25px' }}>
                                                    <Eye size={16} /> View
                                                </Link>
                                                <button 
                                                    onClick={() => handleDelete(trip.id)}
                                                    style={{ padding: '10px', borderRadius: '12px', border: '1px solid #eee', color: 'var(--error)', background: '#FEF2F2', cursor: 'pointer' }}
                                                >
                                                    <Trash2 size={20} />
                                                </button>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', border: '2px dashed #eee', borderRadius: '20px' }}>No {cat.title.toLowerCase()} trips found.</p>
                                )}
                            </div>
                        </section>
                    );
                })}
            </div>
        </Layout>
    );
};

export default MyTrips;
