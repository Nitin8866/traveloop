import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, Globe, Camera, Edit, Calendar, Star } from 'lucide-react';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useAuth();
    const [trips, setTrips] = useState([]);

    useEffect(() => {
        const fetchTrips = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } });
            setTrips(res.data);
        };
        fetchTrips();
    }, []);

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                {/* Header Section (Matches Wireframe) */}
                <div className="premium-card" style={{ display: 'flex', gap: '3rem', alignItems: 'center', marginBottom: '4rem', padding: '3rem' }}>
                    <div style={{ position: 'relative' }}>
                        <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=00B8D4&color=fff&size=200`} style={{ width: '180px', height: '180px', borderRadius: '48px', border: '8px solid #F9FAFB' }} alt="User" />
                        <button style={{ position: 'absolute', bottom: '0', right: '0', background: 'var(--primary-gradient)', color: 'white', padding: '12px', borderRadius: '16px', border: '4px solid white' }}>
                            <Camera size={20} />
                        </button>
                    </div>
                    <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <div>
                                <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{user?.firstName} {user?.lastName}</h1>
                                <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem', marginBottom: '1.5rem' }}>Travel Enthusiast & Digital Nomad</p>
                            </div>
                            <button className="btn-primary" style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}>
                                <Edit size={18} /> Edit Profile
                            </button>
                        </div>
                        <p style={{ color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
                            User Details with appropriate option to edit those information. I love exploring hidden gems in Europe and Asia. Traveling is my passion and sharing my experiences is my mission.
                        </p>
                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <div style={{ textAlign: 'center' }}><p style={{ fontWeight: 800, fontSize: '1.4rem' }}>{trips.length}</p><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Trips</p></div>
                            <div style={{ textAlign: 'center' }}><p style={{ fontWeight: 800, fontSize: '1.4rem' }}>14</p><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Reviews</p></div>
                            <div style={{ textAlign: 'center' }}><p style={{ fontWeight: 800, fontSize: '1.4rem' }}>2.4k</p><p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Followers</p></div>
                        </div>
                    </div>
                </div>

                {/* Preplanned Trips Section */}
                <section style={{ marginBottom: '4rem' }}>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Preplanned Trips</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {trips.slice(0, 3).map(trip => (
                            <div key={trip.id} className="premium-card" style={{ padding: '1rem' }}>
                                <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34'} style={{ width: '100%', height: '160px', borderRadius: '16px', objectFit: 'cover', marginBottom: '1rem' }} alt="" />
                                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{trip.name}</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}><Calendar size={12} /> Upcoming</span>
                                    <Link to={`/itinerary/${trip.id}`} className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem' }}>View</Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Previous Trips Section */}
                <section>
                    <h2 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '2rem' }}>Previous Trips</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem' }}>
                        {[1, 2, 3].map(i => (
                            <div key={i} className="premium-card" style={{ padding: '1rem' }}>
                                <div style={{ height: '160px', borderRadius: '16px', overflow: 'hidden', marginBottom: '1rem', position: 'relative' }}>
                                    <img src={`https://images.unsplash.com/photo-${1500000000000 + i * 1000000}?auto=format&fit=crop&w=300`} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'white', padding: '4px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800 }}>Completed</div>
                                </div>
                                <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>Journey through Europe</h4>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B' }}><Star size={14} fill="#F59E0B" /> 5.0</div>
                                    <button className="btn-primary" style={{ padding: '6px 16px', fontSize: '0.8rem', background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}>View</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </Layout>
    );
};

export default Profile;
