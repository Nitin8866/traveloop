import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, LogIn, Plane } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate('/');
        } catch (error) {
            alert(error.response?.data?.message || 'Login failed');
        }
    };

    return (
        <div style={{ minHeight: '100vh', display: 'flex', background: 'linear-gradient(135deg, var(--primary), var(--primary-light))', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
            <div className="premium-card animate-fade-in" style={{ width: '100%', maxWidth: '450px', background: 'rgba(255, 255, 255, 0.95)', backdropFilter: 'blur(10px)', padding: '3rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <div style={{ display: 'inline-flex', padding: '15px', borderRadius: '50%', background: 'var(--primary)', color: 'white', marginBottom: '1.5rem' }}>
                        <Plane size={32} />
                    </div>
                    <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>Welcome Back</h2>
                    <p style={{ color: 'var(--text-muted)' }}>Login to continue your journey</p>
                </div>

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ position: 'relative' }}>
                        <Mail size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="email" 
                            placeholder="Email Address" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none', transition: '0.3s' }}
                            required
                        />
                    </div>
                    <div style={{ position: 'relative' }}>
                        <Lock size={20} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                        <input 
                            type="password" 
                            placeholder="Password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '12px', border: '1px solid #ddd', outline: 'none' }}
                            required
                        />
                    </div>

                    <div style={{ textAlign: 'right' }}>
                        <a href="#" style={{ color: 'var(--primary)', fontSize: '0.9rem', textDecoration: 'none', fontWeight: 600 }}>Forgot Password?</a>
                    </div>

                    <button type="submit" className="btn-primary" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', padding: '1rem' }}>
                        <LogIn size={20} /> Login to Account
                    </button>
                </form>

                <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)' }}>
                    Don't have an account? <Link to="/signup" style={{ color: 'var(--secondary)', fontWeight: 700, textDecoration: 'none' }}>Sign Up</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
