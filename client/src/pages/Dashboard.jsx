import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, MapPin, Calendar, Compass, ArrowRight, Star, SlidersHorizontal, LayoutGrid } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } });
                setTrips(res.data);
                setLoading(false);
            } catch (err) { setLoading(false); }
        };
        fetchTrips();
    }, []);

    const regions = [
        { name: 'Western Europe', img: 'https://images.unsplash.com/photo-1467269204594-9661b134dd2b?auto=format&fit=crop&w=300' },
        { name: 'South Asia', img: 'https://images.unsplash.com/photo-1524492707947-2f354641ad35?auto=format&fit=crop&w=300' },
        { name: 'North America', img: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=300' },
        { name: 'Scandinavia', img: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=300' },
        { name: 'Middle East', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=300' },
    ];

    return (
        <Layout>
            <div className="animate-fade-in">
                {/* Screen 3: Banner Image */}
                <div style={{ 
                    height: '400px', 
                    borderRadius: '32px', 
                    backgroundImage: 'url(https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=1400)', 
                    backgroundSize: 'cover', 
                    backgroundPosition: 'center',
                    marginBottom: '2rem',
                    position: 'relative',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    padding: '0 4rem'
                }}>
                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(0,0,0,0.6), transparent)' }}></div>
                    <div style={{ position: 'relative', color: 'white', maxWidth: '600px' }}>
                        <h1 style={{ color: 'white', fontSize: '3.5rem', fontWeight: 900, marginBottom: '1rem', lineHeight: 1 }}>Your Next Journey Starts Here.</h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>Discover unique multi-city itineraries tailored to your style and budget.</p>
                        <Link to="/create-trip" className="btn-primary" style={{ padding: '16px 32px' }}>Start Planning <Plus size={20} /></Link>
                    </div>
                </div>

                {/* Filter Bar (Matches Wireframe) */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Compass size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search for cities or destinations..." style={{ width: '100%', paddingLeft: '48px', border: '1px solid #eee' }} />
                    </div>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </div>

                {/* Top Regional Selections */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.6rem', marginBottom: '1.5rem', fontWeight: 800 }}>Top Regional Selections</h2>
                    <div style={{ display: 'flex', gap: '1.5rem', overflowX: 'auto', paddingBottom: '1rem' }}>
                        {regions.map((region, i) => (
                            <div key={i} style={{ flex: '0 0 200px', textAlign: 'center' }}>
                                <div style={{ height: '140px', borderRadius: '24px', overflow: 'hidden', marginBottom: '0.8rem', border: '4px solid white', boxShadow: 'var(--shadow)' }}>
                                    <img src={region.img} alt={region.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                                <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{region.name}</p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Previous/My Trips */}
                <section>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800 }}>My Journeys</h2>
                        <Link to="/my-trips" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>See all trips</Link>
                    </div>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '2rem' }}>
                        {trips.slice(0, 3).map(trip => (
                            <Link key={trip.id} to={`/itinerary/${trip.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                                <div className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                                    <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=600'} style={{ width: '100%', height: '200px', objectFit: 'cover' }} alt={trip.name} />
                                    <div style={{ padding: '1.5rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                                            <h3 style={{ fontSize: '1.2rem' }}>{trip.name}</h3>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}><Star size={14} fill="#F59E0B" /> 4.9</div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> Multi-city</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Dashboard;
