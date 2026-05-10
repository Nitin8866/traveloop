import React from 'react';
import { NavLink, useNavigate, Link } from 'react-router-dom';
import { Home, Map, Compass, User, LogOut, Plane, Search, Bell } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Layout = ({ children }) => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { icon: <Home size={20} />, label: 'Dashboard', path: '/' },
        { icon: <Map size={20} />, label: 'My Trips', path: '/my-trips' },
        { icon: <Compass size={20} />, label: 'Explore', path: '/explore' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'white', borderRight: '1px solid var(--border)', padding: '2.5rem 1.5rem', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column', zIndex: 100 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '3.5rem', paddingLeft: '10px' }}>
                    <div style={{ background: 'var(--primary-gradient)', padding: '8px', borderRadius: '12px' }}>
                        <Plane size={24} color="white" />
                    </div>
                    <h2 style={{ color: 'var(--text-main)', fontSize: '1.6rem', fontWeight: 800, letterSpacing: '-0.5px' }}>Traveloop</h2>
                </div>

                <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {navItems.map((item, i) => (
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
                                color: isActive ? 'var(--primary)' : 'var(--text-muted)',
                                background: isActive ? 'rgba(0, 184, 212, 0.08)' : 'transparent',
                                transition: 'var(--transition)',
                                fontWeight: isActive ? 700 : 500
                            })}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
                    <NavLink to="/profile" style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', marginBottom: '1rem', textDecoration: 'none', color: 'var(--text-main)' }}>
                        <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=00B8D4&color=fff`} style={{ width: '40px', height: '40px', borderRadius: '12px' }} />
                        <div>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{user?.firstName} {user?.lastName}</p>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pro Member</p>
                        </div>
                    </NavLink>
                    <button 
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: 'var(--error)', background: '#FEF2F2', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                    >
                        <LogOut size={18} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: '280px' }}>
                {/* Top Nav Bar */}
                <header style={{ 
                    height: '80px', 
                    background: 'white', 
                    borderBottom: '1px solid var(--border)', 
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
                            placeholder="Search trips, cities, or activities..." 
                            style={{ width: '100%', padding: '10px 16px 10px 48px', background: '#F9FAFB', border: '1px solid #F3F4F6' }}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <button style={{ padding: '10px', borderRadius: '12px', background: '#F9FAFB', border: 'none', cursor: 'pointer' }}><Bell size={20} color="#555" /></button>
                        <Link to="/create-trip" className="btn-primary" style={{ textDecoration: 'none', padding: '10px 20px', fontSize: '0.9rem' }}>
                            <Plane size={18} /> Plan a Trip
                        </Link>
                    </div>
                </header>

                <div style={{ padding: '2.5rem 3rem' }}>
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
