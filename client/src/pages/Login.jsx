import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Plane, Mail, Lock, ArrowRight, UserCircle } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await login(email, password);
            navigate('/');
        } catch (err) {
            alert('Invalid credentials');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: 'var(--bg-main)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
            <div className="premium-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', textAlign: 'center', padding: '3.5rem' }}>
                <div style={{ background: 'var(--primary-gradient)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                    <Plane size={32} color="white" />
                </div>
                
                <h1 style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Welcome Back</h1>
                <p style={{ color: 'var(--text-muted)', marginBottom: '3rem' }}>Sign in to continue your global adventure</p>

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            style={{ width: '100%', padding: '14px 16px 14px 48px' }} 
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            style={{ width: '100%', padding: '14px 16px 14px 48px' }} 
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '16px', fontSize: '1.1rem', marginTop: '1rem' }}>
                        Sign In <ArrowRight size={20} />
                    </button>
                </form>

                <p style={{ marginTop: '2.5rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none' }}>Create Account</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
