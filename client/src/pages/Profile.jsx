import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, MapPin, Globe, Camera, Shield, Bell } from 'lucide-react';

const Profile = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: user?.firstName || '',
        lastName: user?.lastName || '',
        email: user?.email || '',
        city: 'New York',
        country: 'USA',
        bio: 'Avid traveler and photography enthusiast. Looking for my next adventure in Europe!'
    });

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Account Settings</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Manage your personal information and travel preferences.</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '3rem' }}>
                    {/* Left: Avatar & Quick Links */}
                    <aside>
                        <div className="premium-card" style={{ textAlign: 'center', padding: '2.5rem' }}>
                            <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                                <img src={`https://ui-avatars.com/api/?name=${formData.firstName}+${formData.lastName}&background=0f4c5c&color=fff&size=128`} style={{ width: '120px', height: '120px', borderRadius: '32px' }} alt="Profile" />
                                <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--secondary)', color: 'white', padding: '8px', borderRadius: '12px', border: '3px solid white' }}>
                                    <Camera size={16} />
                                </button>
                            </div>
                            <h3 style={{ marginBottom: '0.4rem' }}>{formData.firstName} {formData.lastName}</h3>
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>Joined May 2024</p>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                <button style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8f9fa', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}><Shield size={18} /> Privacy</button>
                                <button style={{ width: '100%', padding: '12px', borderRadius: '10px', background: '#f8f9fa', color: 'var(--primary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '10px' }}><Bell size={18} /> Notifications</button>
                            </div>
                        </div>
                    </aside>

                    {/* Right: Form */}
                    <div className="premium-card">
                        <h3 style={{ marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>Personal Information</h3>
                        <form style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>First Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="text" value={formData.firstName} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Last Name</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="text" value={formData.lastName} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Email Address</label>
                                <div style={{ position: 'relative' }}>
                                    <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="email" value={formData.email} disabled style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd', background: '#f8f9fa', color: '#999' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>City</label>
                                <div style={{ position: 'relative' }}>
                                    <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="text" value={formData.city} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Country</label>
                                <div style={{ position: 'relative' }}>
                                    <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} />
                                    <input type="text" value={formData.country} style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} />
                                </div>
                            </div>
                            <div style={{ gridColumn: 'span 2' }}>
                                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, fontSize: '0.9rem' }}>Traveler Bio</label>
                                <textarea value={formData.bio} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: '1px solid #ddd', minHeight: '100px', resize: 'none' }} />
                            </div>
                            <button className="btn-primary" style={{ gridColumn: 'span 2', padding: '1rem', marginTop: '1rem' }}>Update Profile Details</button>
                        </form>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default Profile;
