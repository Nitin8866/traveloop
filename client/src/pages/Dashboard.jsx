import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, MapPin, Calendar, TrendingUp, Compass, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const [trips, setTrips] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrips = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/trips', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setTrips(res.data.slice(0, 3)); // Show only latest 3
                setLoading(false);
            } catch (error) {
                setLoading(false);
            }
        };
        fetchTrips();
    }, []);

    return (
        <Layout>
            <div className="animate-fade-in">
                {/* Hero Card */}
                <div style={{ 
                    background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', 
                    borderRadius: '24px', 
                    padding: '3.5rem', 
                    color: 'white', 
                    position: 'relative', 
                    overflow: 'hidden',
                    marginBottom: '3rem',
                    boxShadow: '0 20px 40px rgba(15, 76, 92, 0.2)'
                }}>
                    <div style={{ position: 'relative', zIndex: 1, maxWidth: '600px' }}>
                        <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1.2rem', lineHeight: 1.1 }}>Explore the world, one city at a time.</h1>
                        <p style={{ fontSize: '1.2rem', opacity: 0.9, marginBottom: '2.5rem' }}>Traveloop helps you design, organize, and budget your multi-city adventures effortlessly.</p>
                        <Link to="/create-trip" className="btn-primary" style={{ background: 'var(--secondary)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '10px' }}>
                            <Plus size={20} /> Plan New Adventure
                        </Link>
                    </div>
                    <Compass size={300} style={{ position: 'absolute', right: '-50px', bottom: '-50px', color: 'rgba(255,255,255,0.05)', transform: 'rotate(-15deg)' }} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Recent Trips Section */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem' }}>Your Recent Journeys</h3>
                            <Link to="/my-trips" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '5px' }}>View All <ArrowRight size={16} /></Link>
                        </div>

                        {loading ? (
                            <p>Loading trips...</p>
                        ) : trips.length > 0 ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {trips.map(trip => (
                                    <Link key={trip.id} to={`/itinerary/${trip.id}`} className="premium-card" style={{ display: 'flex', gap: '1.5rem', padding: '1rem', textDecoration: 'none', color: 'inherit' }}>
                                        <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=200'} style={{ width: '100px', height: '100px', borderRadius: '14px', objectFit: 'cover' }} alt={trip.name} />
                                        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                            <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{trip.name}</h4>
                                            <div style={{ display: 'flex', gap: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(trip.start_date).toLocaleDateString()}</span>
                                                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> Multi-city</span>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', paddingRight: '1rem' }}>
                                            <ArrowRight size={20} color="#ccc" />
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div style={{ padding: '3rem', textAlign: 'center', border: '2px dashed #ddd', borderRadius: '24px' }}>
                                <p style={{ color: 'var(--text-muted)' }}>No journeys planned yet. Start your first one!</p>
                            </div>
                        )}
                    </section>

                    {/* Popular Destinations Sidebar */}
                    <aside>
                        <div className="premium-card" style={{ background: 'white', border: '1px solid #eee' }}>
                            <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}><TrendingUp size={20} color="var(--secondary)" /> Trending Now</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {[
                                    { city: 'Santorini', country: 'Greece', img: 'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?auto=format&fit=crop&q=80&w=100' },
                                    { city: 'Kyoto', country: 'Japan', img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&q=80&w=100' },
                                    { city: 'Amalfi', country: 'Italy', img: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&q=80&w=100' }
                                ].map((item, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                                        <img src={item.img} style={{ width: '50px', height: '50px', borderRadius: '10px', objectFit: 'cover' }} alt={item.city} />
                                        <div>
                                            <p style={{ fontWeight: 700, fontSize: '0.95rem' }}>{item.city}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{item.country}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: '2rem', background: '#f8f9fa', color: 'var(--primary)', boxShadow: 'none' }}>Discover More</button>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default Dashboard;
