import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Calendar, MapPin, MoreVertical, Trash2, Eye, Edit } from 'lucide-react';
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
            console.error('Error fetching trips');
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this trip?')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/trips/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            fetchTrips();
        } catch (error) {
            alert('Error deleting trip');
        }
    };

    useEffect(() => {
        fetchTrips();
    }, []);

    if (loading) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading your journeys...</div>;

    return (
        <div style={{ padding: '4rem 5%', minHeight: '100vh' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>My Journeys</h1>
                    <p style={{ color: 'var(--text-muted)' }}>You have {trips.length} active trip plans</p>
                </div>
                <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none' }}>+ New Trip</Link>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                {trips.map(trip => (
                    <div key={trip.id} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                        <div style={{ height: '200px', position: 'relative' }}>
                            <img 
                                src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'} 
                                alt={trip.name} 
                                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                            />
                            <div style={{ position: 'absolute', top: '15px', right: '15px', display: 'flex', gap: '8px' }}>
                                <button onClick={() => handleDelete(trip.id)} style={{ background: 'white', color: '#e74c3c', width: '35px', height: '35px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', shadow: '0 4px 10px rgba(0,0,0,0.1)' }}><Trash2 size={16} /></button>
                            </div>
                        </div>
                        <div style={{ padding: '1.5rem' }}>
                            <h3 style={{ marginBottom: '0.8rem' }}>{trip.name}</h3>
                            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.2rem' }}>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={16} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={16} /> Multi-city</span>
                            </div>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem', height: '40px', overflow: 'hidden' }}>{trip.description || 'No description provided.'}</p>
                            
                            <div style={{ display: 'flex', gap: '1rem' }}>
                                <Link to={`/itinerary/${trip.id}`} style={{ flex: 1, textDecoration: 'none', background: 'var(--primary)', color: 'white', padding: '0.8rem', borderRadius: '8px', textAlign: 'center', fontWeight: 600, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <Eye size={18} /> View Trip
                                </Link>
                                <button style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd', background: 'white' }}><Edit size={18} /></button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {trips.length === 0 && (
                <div style={{ textAlign: 'center', padding: '5rem', background: '#f0f2f5', borderRadius: 'var(--radius)' }}>
                    <h3>No trips planned yet</h3>
                    <p style={{ marginBottom: '1.5rem' }}>Ready to start your adventure?</p>
                    <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none' }}>Create Your First Trip</Link>
                </div>
            )}
        </div>
    );
};

export default MyTrips;
