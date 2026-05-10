import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { 
    User, Mail, Phone, MapPin, Globe, Edit3, Save, 
    Calendar, Eye, Camera, ArrowLeft, Loader2, Compass
} from 'lucide-react';

const Profile = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [trips, setTrips] = useState([]);
    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({});

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const token = localStorage.getItem('token');
                const res = await axios.get('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } });
                setProfile(res.data);
                setTrips(res.data.trips || []);
                setFormData({
                    firstName: res.data.firstName,
                    lastName: res.data.lastName,
                    phone: res.data.phone || '',
                    city: res.data.city || '',
                    country: res.data.country || '',
                    bio: res.data.bio || ''
                });
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchProfile();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const token = localStorage.getItem('token');
            const res = await axios.put('/api/auth/profile', formData, { headers: { Authorization: `Bearer ${token}` } });
            setProfile(prev => ({ ...prev, ...res.data.user }));
            
            // Update localStorage user data
            const storedUser = JSON.parse(localStorage.getItem('user'));
            localStorage.setItem('user', JSON.stringify({ ...storedUser, ...res.data.user }));
            
            setEditing(false);
        } catch (err) { console.error(err); alert('Failed to update profile.'); }
        setSaving(false);
    };

    if (loading) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Loading profile...</div></Layout>;
    if (!profile) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}>Profile not found.</div></Layout>;

    const now = new Date();
    const upcomingTrips = trips.filter(t => t.start_date && new Date(t.start_date) > now);
    const pastTrips = trips.filter(t => t.end_date && new Date(t.end_date) < now);

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
                {/* Header */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <button onClick={() => navigate('/')} className="btn-icon" style={{ background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-2px' }}>My Profile</h1>
                </div>

                {/* Profile Card */}
                <div className="premium-card" style={{ padding: '4rem', background: 'white', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', gap: '3rem', alignItems: 'flex-start' }}>
                        {/* Avatar */}
                        <div style={{ position: 'relative' }}>
                            <img 
                                src={`https://ui-avatars.com/api/?name=${profile.firstName}+${profile.lastName}&background=00B8D4&color=fff&size=160`} 
                                style={{ width: '140px', height: '140px', borderRadius: '30px', border: '4px solid white', boxShadow: 'var(--shadow)' }} 
                                alt="avatar" 
                            />
                            <div style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px', cursor: 'pointer' }}>
                                <Camera size={16} color="white" />
                            </div>
                        </div>

                        {/* User Info */}
                        <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                                <div>
                                    {editing ? (
                                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                            <input value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} placeholder="First Name" style={{ padding: '12px', borderRadius: '12px', border: '2px solid #F1F5F9', fontWeight: 700, fontSize: '1.1rem' }} />
                                            <input value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} placeholder="Last Name" style={{ padding: '12px', borderRadius: '12px', border: '2px solid #F1F5F9', fontWeight: 700, fontSize: '1.1rem' }} />
                                        </div>
                                    ) : (
                                        <h2 style={{ fontSize: '2rem', fontWeight: 950, marginBottom: '0.5rem' }}>{profile.firstName} {profile.lastName}</h2>
                                    )}
                                    <p style={{ color: 'var(--text-muted)', fontWeight: 600 }}>{profile.email}</p>
                                </div>
                                {editing ? (
                                    <button onClick={handleSave} className="btn-primary" style={{ padding: '10px 24px' }} disabled={saving}>
                                        {saving ? <Loader2 size={18} className="animate-spin" /> : <><Save size={18} /> Save</>}
                                    </button>
                                ) : (
                                    <button onClick={() => setEditing(true)} style={{ padding: '10px 24px', borderRadius: '12px', border: '1px solid #E2E8F0', background: 'white', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <Edit3 size={16} /> Edit
                                    </button>
                                )}
                            </div>

                            {/* Details Grid */}
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Phone size={18} color="#64748B" />
                                    {editing ? (
                                        <input value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="Phone Number" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #F1F5F9', fontWeight: 600 }} />
                                    ) : (
                                        <span style={{ fontWeight: 600 }}>{profile.phone || 'No phone added'}</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MapPin size={18} color="#64748B" />
                                    {editing ? (
                                        <input value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} placeholder="City" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #F1F5F9', fontWeight: 600 }} />
                                    ) : (
                                        <span style={{ fontWeight: 600 }}>{profile.city || 'No city'}</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Globe size={18} color="#64748B" />
                                    {editing ? (
                                        <input value={formData.country} onChange={e => setFormData({...formData, country: e.target.value})} placeholder="Country" style={{ flex: 1, padding: '10px', borderRadius: '10px', border: '2px solid #F1F5F9', fontWeight: 600 }} />
                                    ) : (
                                        <span style={{ fontWeight: 600 }}>{profile.country || 'No country'}</span>
                                    )}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={18} color="#64748B" />
                                    <span style={{ fontWeight: 600 }}>Joined {new Date(profile.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                                </div>
                            </div>

                            {/* Bio */}
                            <div style={{ marginTop: '2rem' }}>
                                {editing ? (
                                    <textarea value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} placeholder="Tell us about yourself..." style={{ width: '100%', padding: '12px', borderRadius: '12px', border: '2px solid #F1F5F9', fontWeight: 600, minHeight: '80px', fontFamily: 'inherit', resize: 'vertical' }} />
                                ) : (
                                    profile.bio && <p style={{ color: '#475569', lineHeight: 1.8, fontWeight: 500, fontStyle: 'italic' }}>"{profile.bio}"</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Upcoming Trips */}
                <section style={{ marginBottom: '3rem' }}>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Preplanned Trips</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {upcomingTrips.length > 0 ? upcomingTrips.map(trip => (
                            <div key={trip.id} className="premium-card" style={{ padding: 0, overflow: 'hidden' }}>
                                <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400'} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt={trip.name} />
                                <div style={{ padding: '1.2rem' }}>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{trip.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No date'}</p>
                                    <Link to={`/itinerary-view/${trip.id}`} className="btn-primary" style={{ width: '100%', padding: '10px' }}>
                                        <Eye size={16} /> View
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', border: '2px dashed #eee', borderRadius: '20px', gridColumn: '1/-1' }}>No upcoming trips planned.</p>
                        )}
                    </div>
                </section>

                {/* Previous Trips */}
                <section>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 800, marginBottom: '1.5rem' }}>Previous Trips</h2>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
                        {pastTrips.length > 0 ? pastTrips.map(trip => (
                            <div key={trip.id} className="premium-card" style={{ padding: 0, overflow: 'hidden', opacity: 0.8 }}>
                                <img src={trip.cover_photo || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=400'} style={{ width: '100%', height: '160px', objectFit: 'cover' }} alt={trip.name} />
                                <div style={{ padding: '1.2rem' }}>
                                    <h4 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{trip.name}</h4>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>{trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'No date'}</p>
                                    <Link to={`/itinerary-view/${trip.id}`} className="btn-primary" style={{ width: '100%', padding: '10px', background: '#F1F5F9', color: '#333' }}>
                                        <Eye size={16} /> View
                                    </Link>
                                </div>
                            </div>
                        )) : (
                            <p style={{ color: 'var(--text-muted)', padding: '2rem', textAlign: 'center', border: '2px dashed #eee', borderRadius: '20px', gridColumn: '1/-1' }}>No completed trips yet.</p>
                        )}
                    </div>
                </section>
            </div>
            <style>{`
                .btn-icon:hover { background: #E2E8F0 !important; transform: scale(1.05); transition: all 0.2s; }
            `}</style>
        </Layout>
    );
};

export default Profile;
