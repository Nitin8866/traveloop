import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { User, Mail, Lock, Globe, MapPin, UserPlus } from 'lucide-react';

const Signup = () => {
    const [formData, setFormData] = useState({
        firstName: '', lastName: '', email: '', password: '', city: '', country: ''
    });
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await signup(formData);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Signup failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, var(--secondary), var(--accent))', alignItems: 'center', justifyContent: 'center', padding: '40px 20px' }}>
            <div className="premium-card animate-fade-in" style={{ width: '100%', maxWidth: '600px', background: 'white', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>Create Account</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Join Traveloop and start planning your next escape</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="First Name" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, firstName: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <User size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Last Name" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, lastName: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="email" placeholder="Email Address" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, email: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative', gridColumn: 'span 2' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="password" placeholder="Password" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, password: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <MapPin size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="City" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, city: e.target.value})} required />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Globe size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input type="text" placeholder="Country" style={{ width: '100%', padding: '0.8rem 1rem 0.8rem 2.5rem', borderRadius: '10px', border: '1px solid #ddd' }} onChange={(e) => setFormData({...formData, country: e.target.value})} required />
                    </div>

                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '1rem', padding: '1rem' }}>
                        <UserPlus size={20} /> Register User
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;
