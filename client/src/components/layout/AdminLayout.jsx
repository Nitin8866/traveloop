import React, { useEffect } from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, MapPin, Activity, LogOut, Shield, Bell, Search, TrendingUp } from 'lucide-react';

const AdminLayout = ({ children }) => {
    const navigate = useNavigate();

    // Check admin auth
    useEffect(() => {
        const adminToken = localStorage.getItem('adminToken');
        if (!adminToken) {
            navigate('/admin/login');
        }
    }, [navigate]);

    const adminUser = JSON.parse(localStorage.getItem('adminUser') || '{}');

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminUser');
        navigate('/admin/login');
    };

    const adminNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
        { icon: <Users size={20} />, label: 'Manage Users', path: '/admin/users' },
        { icon: <MapPin size={20} />, label: 'Popular Cities', path: '/admin/cities' },
        { icon: <Activity size={20} />, label: 'Popular Activities', path: '/admin/activities' },
        { icon: <TrendingUp size={20} />, label: 'Trends & Analytics', path: '/admin/trends' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F2F5' }}>
            {/* Admin Sidebar - Dark & Professional */}
            <aside style={{ width: '280px', background: '#0F1117', padding: '2.5rem 1.5rem', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100, color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3.5rem', paddingLeft: '10px' }}>
                    <div style={{ background: 'linear-gradient(135deg, #0077B6 0%, #10B981 100%)', padding: '10px', borderRadius: '14px', boxShadow: '0 4px 15px rgba(0,119,182,0.3)' }}>
                        <Shield size={22} color="white" />
                    </div>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.3rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Traveloop</h2>
                        <p style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Admin Console</p>
                    </div>
                </div>

                <p style={{ fontSize: '0.65rem', color: '#4B5563', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '0.8rem', paddingLeft: '16px' }}>
                    Navigation
                </p>
                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    {adminNavItems.map((item, i) => (
                        <NavLink 
                            key={i} 
                            to={item.path} 
                            end={item.path === '/admin'}
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '13px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : '#6B7280',
                                background: isActive ? 'linear-gradient(135deg, rgba(0,119,182,0.2), rgba(16,185,129,0.1))' : 'transparent',
                                transition: 'all 0.25s ease',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '0.9rem',
                                borderLeft: isActive ? '3px solid #0077B6' : '3px solid transparent'
                            })}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '12px' }}>
                        <div style={{ 
                            width: '40px', height: '40px', borderRadius: '12px', 
                            background: 'linear-gradient(135deg, #0077B6, #10B981)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontWeight: 800, color: 'white', fontSize: '0.9rem'
                        }}>
                            {(adminUser?.username || 'A')[0].toUpperCase()}
                        </div>
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.88rem', color: 'white' }}>{adminUser?.username || 'Admin'}</p>
                            <p style={{ fontSize: '0.68rem', color: '#10B981', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 4 }}>
                                <span style={{ width: 6, height: 6, background: '#10B981', borderRadius: '50%', display: 'inline-block' }} />
                                Online
                            </p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ 
                            width: '100%', display: 'flex', alignItems: 'center', gap: '12px', 
                            padding: '12px 16px', borderRadius: '12px', color: '#EF4444', 
                            background: 'rgba(239, 68, 68, 0.08)', fontWeight: 700, 
                            border: '1px solid rgba(239,68,68,0.1)', cursor: 'pointer',
                            fontSize: '0.88rem', transition: 'all 0.2s ease'
                        }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Admin Area */}
            <main style={{ flex: 1, marginLeft: '280px' }}>
                <header style={{ 
                    height: '72px', 
                    background: 'rgba(255,255,255,0.8)', 
                    backdropFilter: 'blur(10px)',
                    borderBottom: '1px solid #E5E7EB', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0 2.5rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ position: 'relative', width: '360px' }}>
                        <Search size={16} style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            type="text" 
                            placeholder="Search anything..." 
                            style={{ 
                                width: '100%', padding: '10px 16px 10px 42px', 
                                background: '#F9FAFB', border: '1px solid #F3F4F6', 
                                borderRadius: '10px', fontSize: '0.88rem' 
                            }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1.2rem', alignItems: 'center' }}>
                        <button style={{ position: 'relative', padding: '8px', borderRadius: '10px', background: '#F9FAFB', border: '1px solid #F3F4F6', cursor: 'pointer' }}>
                            <Bell size={18} color="#555" />
                            <span style={{ position: 'absolute', top: '6px', right: '6px', width: '7px', height: '7px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>
                        <div style={{ height: '28px', width: '1px', background: '#E5E7EB' }}></div>
                        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.85rem' }}>← User View</Link>
                    </div>
                </header>

                <div style={{ padding: '2rem 2.5rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
