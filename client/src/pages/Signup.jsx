import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { User, Mail, Lock, Phone, MapPin, Globe, ArrowRight, Camera } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', phone: '', city: '', country: ''
    });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/');
        } catch (err) {
            alert('Signup failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '3rem 2rem' }}>
            <div className="premium-card animate-fade-in" style={{ width: '100%', maxWidth: '700px', padding: '4rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '1.5rem' }}>
                        <div style={{ width: '100px', height: '100px', borderRadius: '35px', background: '#F3F4F6', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--border)' }}>
                            <User size={40} color="#9CA3AF" />
                        </div>
                        <button style={{ position: 'absolute', bottom: '-5px', right: '-5px', background: 'var(--primary-gradient)', color: 'white', border: '3px solid white', borderRadius: '12px', padding: '6px' }}>
                            <Camera size={14} />
                        </button>
                    </div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Join Traveloop</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Start designing your dream itineraries today</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="First Name" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Last Name" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="email" placeholder="Email Address" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Phone size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Phone Number" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, phone: e.target.value})} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="password" placeholder="Password" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="City" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Globe size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Country" style={{ width: '100%', paddingLeft: '48px' }} onChange={(e) => setFormData({...formData, country: e.target.value})} />
                    </div>
                    
                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '16px', marginTop: '1.5rem', fontSize: '1.1rem' }}>
                        Register Account <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ marginTop: '2.5rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Log In</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
