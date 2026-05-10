import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Calendar, MapPin, Trash2, Eye, Compass, Clock, CheckCircle2, SlidersHorizontal } from 'lucide-react';
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

    useEffect(() => { fetchTrips(); }, []);

    const categories = [
        { title: 'Ongoing', icon: <Clock size={20} color="var(--primary)" />, filter: 'ongoing' },
        { title: 'Up-coming', icon: <Calendar size={20} color="var(--warning)" />, filter: 'upcoming' },
        { title: 'Completed', icon: <CheckCircle2 size={20} color="var(--accent)" />, filter: 'completed' },
    ];

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

                {categories.map((cat, i) => (
                    <section key={i} style={{ marginBottom: '4rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2rem', borderBottom: '1px solid #f0f0f0', paddingBottom: '1rem' }}>
                            {cat.icon}
                            <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>{cat.title}</h2>
                        </div>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {trips.length > 0 ? (
                                trips.map(trip => (
                                    <div key={trip.id} className="premium-card animate-fade-in" style={{ padding: '1.5rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                        <div style={{ width: '120px', height: '120px', borderRadius: '20px', overflow: 'hidden' }}>
                                            <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828'} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={trip.name} />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '8px' }}>{trip.name}</h3>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem' }}>Short Over View of the Trip: Multi-city adventure through Europe focusing on culture and food.</p>
                                            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> 4 Cities</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px' }}>
                                            <Link to={`/itinerary/${trip.id}`} className="btn-primary" style={{ padding: '10px 25px' }}>View</Link>
                                            <button style={{ padding: '10px', borderRadius: '12px', border: '1px solid #eee', color: 'var(--error)', background: '#FEF2F2' }}><Trash2 size={20} /></button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', border: '2px dashed #eee', borderRadius: '20px' }}>No {cat.title.toLowerCase()} trips found.</p>
                            )}
                        </div>
                    </section>
                ))}
            </div>
        </Layout>
    );
};

export default MyTrips;
