import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Home, Map, CheckSquare, DollarSign, User, LogOut, Plane, Compass } from 'lucide-react';
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
        { icon: <Map size={20} />, label: 'My Journeys', path: '/my-trips' },
        { icon: <Plane size={20} />, label: 'Start New Trip', path: '/create-trip' },
        { icon: <Compass size={20} />, label: 'Explore Cities', path: '/explore' },
    ];

    return (
        <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-main)' }}>
            {/* Sidebar */}
            <aside style={{ width: '280px', background: 'var(--primary)', color: 'white', padding: '2rem 1.5rem', position: 'fixed', height: '100vh', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '3rem', paddingLeft: '10px' }}>
                    <div style={{ background: 'var(--secondary)', padding: '8px', borderRadius: '12px' }}>
                        <Plane size={24} color="white" />
                    </div>
                    <h2 style={{ color: 'white', fontSize: '1.5rem', margin: 0 }}>Traveloop</h2>
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
                                padding: '12px 16px',
                                borderRadius: '12px',
                                textDecoration: 'none',
                                color: isActive ? 'white' : 'rgba(255,255,255,0.6)',
                                background: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                                transition: 'var(--transition)',
                                fontWeight: isActive ? 600 : 400
                            })}
                        >
                            {item.icon} {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '1.5rem' }}>
                    <button 
                        onClick={handleLogout}
                        style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 16px', borderRadius: '12px', color: '#ff7675', background: 'transparent', fontWeight: 600 }}
                    >
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, marginLeft: '280px', padding: '2rem 3rem' }}>
                <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h4 style={{ color: 'var(--text-muted)', marginBottom: '4px' }}>Welcome back,</h4>
                        <h2 style={{ fontSize: '1.8rem' }}>{user?.firstName} {user?.lastName}</h2>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                         <div style={{ textAlign: 'right' }}>
                            <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>Nitin Maharaj</p>
                            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pro Traveler</p>
                         </div>
                         <img src={`https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=0f4c5c&color=fff`} style={{ width: '45px', height: '45px', borderRadius: '12px' }} />
                    </div>
                </header>
                {children}
            </main>
        </div>
    );
};

export default Layout;
