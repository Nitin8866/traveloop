import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { LayoutDashboard, Users, Map, Activity, LogOut, Shield, Bell, Settings, Search } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const AdminLayout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const adminNavItems = [
        { icon: <LayoutDashboard size={20} />, label: 'Overview', path: '/admin' },
        { icon: <Users size={20} />, label: 'User Management', path: '/admin/users' },
        { icon: <Map size={20} />, label: 'Destinations', path: '/admin/destinations' },
        { icon: <Activity size={20} />, label: 'System Health', path: '/admin/health' },
        { icon: <Settings size={20} />, label: 'Settings', path: '/admin/settings' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: '#F0F2F5' }}>
            {/* Admin Sidebar - Dark & Professional */}
            <aside style={{ width: '280px', background: '#1A1D21', padding: '2.5rem 1.5rem', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100, color: 'white' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3.5rem', paddingLeft: '10px' }}>
                    <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px' }}>
                        <Shield size={24} color="white" />
                    </div>
                    <div>
                        <h2 style={{ color: 'white', fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.5px', margin: 0 }}>Traveloop</h2>
                        <p style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Admin Console</p>
                    </div>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {adminNavItems.map((item, i) => (
                        <NavLink 
                            key={i} 
                            to={item.path} 
                            style={({ isActive }) => ({
                                display: 'flex',
                                alignItems: 'center',
                                gap: '12px',
                                padding: '14px 16px',
                                borderRadius: '14px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : '#9CA3AF',
                                background: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                                transition: 'var(--transition)',
                                fontWeight: isActive ? 700 : 500
                            })}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '1rem' }}>
                        <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+Admin&background=fff&color=1A1D21`} style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.firstName} (Admin)</p>
                            <p style={{ fontSize: '0.7rem', color: '#10B981', fontWeight: 800 }}>● Online</p>
                        </div>
                    </div>
                    <button 
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#EF4444', background: 'rgba(239, 68, 68, 0.1)', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Admin Area */}
            <main style={{ flex: 1, marginLeft: '280px' }}>
                <header style={{ 
                    height: '80px', 
                    background: 'white', 
                    borderBottom: '1px solid #E5E7EB', 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'space-between', 
                    padding: '0 3rem',
                    position: 'sticky',
                    top: 0,
                    zIndex: 90
                }}>
                    <div style={{ position: 'relative', width: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            type="text" 
                            placeholder="Global admin search..." 
                            style={{ width: '100%', padding: '10px 16px 10px 48px', background: '#F9FAFB', border: '1px solid #F3F4F6', borderRadius: '10px' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        <button style={{ position: 'relative', padding: '10px', borderRadius: '12px', background: '#F9FAFB', border: 'none' }}>
                            <Bell size={20} color="#555" />
                            <span style={{ position: 'absolute', top: '8px', right: '8px', width: '8px', height: '8px', background: '#EF4444', borderRadius: '50%', border: '2px solid white' }}></span>
                        </button>
                        <div style={{ height: '32px', width: '1px', background: '#E5E7EB' }}></div>
                        <Link to="/" style={{ color: 'var(--primary)', fontWeight: 700, textDecoration: 'none', fontSize: '0.9rem' }}>Switch to User View</Link>
                    </div>
                </header>

                <div style={{ padding: '2.5rem 3rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
