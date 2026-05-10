import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, User, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import axios from 'axios';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const res = await axios.post('/api/admin/login', { username, password });
            localStorage.setItem('adminToken', res.data.token);
            localStorage.setItem('adminUser', JSON.stringify(res.data.admin));
            navigate('/admin');
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid admin credentials');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            minHeight: '100vh', 
            background: '#0F1117',
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            padding: '2rem',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Animated background orbs */}
            <div style={{
                position: 'absolute', width: '400px', height: '400px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(0,119,182,0.15) 0%, transparent 70%)',
                top: '-100px', right: '-100px', animation: 'pulse 4s ease-in-out infinite'
            }} />
            <div style={{
                position: 'absolute', width: '300px', height: '300px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(16,185,129,0.1) 0%, transparent 70%)',
                bottom: '-80px', left: '-80px', animation: 'pulse 4s ease-in-out infinite 2s'
            }} />

            <div className="animate-fade-in" style={{ 
                width: '100%', 
                maxWidth: '460px', 
                textAlign: 'center', 
                padding: '3.5rem',
                background: 'rgba(255,255,255,0.03)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '24px',
                backdropFilter: 'blur(20px)',
                boxShadow: '0 25px 60px rgba(0,0,0,0.5)'
            }}>
                <div style={{ 
                    background: 'linear-gradient(135deg, #0077B6 0%, #10B981 100%)', 
                    width: '72px', height: '72px', borderRadius: '20px', 
                    display: 'flex', alignItems: 'center', justifyContent: 'center', 
                    margin: '0 auto 1.5rem',
                    boxShadow: '0 8px 30px rgba(0,119,182,0.3)'
                }}>
                    <Shield size={36} color="white" />
                </div>
                
                <h1 style={{ fontSize: '2rem', marginBottom: '0.4rem', fontWeight: 800, color: 'white', letterSpacing: '-0.5px' }}>
                    Admin Console
                </h1>
                <p style={{ color: '#6B7280', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                    Secure access to the Traveloop control center
                </p>

                {error && (
                    <div style={{ 
                        display: 'flex', alignItems: 'center', gap: '10px',
                        padding: '14px 18px', borderRadius: '14px',
                        background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                        color: '#F87171', marginBottom: '1.5rem', fontSize: '0.9rem',
                        textAlign: 'left'
                    }}>
                        <AlertCircle size={18} />
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ textAlign: 'left', display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Username
                        </label>
                        <div style={{ position: 'relative' }}>
                            <User size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
                            <input 
                                type="text" 
                                placeholder="Enter admin username" 
                                value={username}
                                style={{ 
                                    width: '100%', padding: '14px 16px 14px 48px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px', color: 'white', fontSize: '1rem'
                                }} 
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', color: '#9CA3AF', fontSize: '0.8rem', fontWeight: 600, marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                            Password
                        </label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#4B5563' }} />
                            <input 
                                type="password" 
                                placeholder="Enter admin password" 
                                value={password}
                                style={{ 
                                    width: '100%', padding: '14px 16px 14px 48px',
                                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                                    borderRadius: '14px', color: 'white', fontSize: '1rem'
                                }} 
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            padding: '16px', fontSize: '1.05rem', marginTop: '0.8rem',
                            background: 'linear-gradient(135deg, #0077B6 0%, #10B981 100%)',
                            color: 'white', border: 'none', borderRadius: '14px',
                            fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
                            opacity: loading ? 0.7 : 1,
                            transition: 'all 0.3s ease',
                            boxShadow: '0 4px 20px rgba(0,119,182,0.3)'
                        }}
                    >
                        {loading ? 'Authenticating...' : 'Access Dashboard'} 
                        {!loading && <ArrowRight size={20} />}
                    </button>
                </form>

                <p style={{ marginTop: '2rem', color: '#4B5563', fontSize: '0.8rem' }}>
                    🔒 Protected by end-to-end encryption
                </p>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { transform: scale(1); opacity: 0.5; }
                    50% { transform: scale(1.1); opacity: 0.8; }
                }
            `}</style>
        </div>
    );
};

export default AdminLogin;
