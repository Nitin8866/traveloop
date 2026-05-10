import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Users, Map, TrendingUp, DollarSign, Trash2, 
    MapPin, BarChart3, Activity, Loader2, Crown,
    SlidersHorizontal, LayoutGrid, Search
} from 'lucide-react';

const AdminPanel = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [cities, setCities] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    useEffect(() => {
        const fetchAll = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                
                const [statsRes, usersRes, citiesRes, activitiesRes] = await Promise.all([
                    axios.get('/api/admin/stats', { headers }),
                    axios.get('/api/admin/users', { headers }),
                    axios.get('/api/admin/popular-cities', { headers }),
                    axios.get('/api/admin/popular-activities', { headers })
                ]);
                
                setStats(statsRes.data);
                setUsers(usersRes.data);
                setCities(citiesRes.data);
                setActivities(activitiesRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchAll();
    }, []);

    const deleteUser = async (id) => {
        if (!window.confirm('Delete this user? All their trips will be removed.')) return;
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/admin/users/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setUsers(users.filter(u => u.id !== id));
        } catch (err) { alert(err.response?.data?.message || 'Error deleting user.'); }
    };

    if (loading) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" size={40} /> Loading admin panel...</div></Layout>;

    const tabs = [
        { id: 'overview', label: 'Overview', icon: <BarChart3 size={18} /> },
        { id: 'users', label: 'Users', icon: <Users size={18} /> },
        { id: 'insights', label: 'Insights', icon: <TrendingUp size={18} /> },
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Monitor platform usage and manage users.</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#FEF3C7', padding: '8px 16px', borderRadius: '10px' }}>
                        <Crown size={18} color="#D97706" />
                        <span style={{ fontWeight: 700, color: '#92400E', fontSize: '0.85rem' }}>Admin Access</span>
                    </div>
                </div>

                {/* Filter Bar */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search users, cities..." style={{ width: '100%', paddingLeft: '48px', border: '1px solid #eee' }} />
                    </div>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </div>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '3rem', borderBottom: '1px solid #E2E8F0', paddingBottom: '1rem' }}>
                    {tabs.map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                padding: '10px 24px', borderRadius: '12px', border: 'none', 
                                background: activeTab === tab.id ? '#000' : '#F1F5F9',
                                color: activeTab === tab.id ? '#fff' : '#555',
                                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                                transition: 'all 0.2s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                {activeTab === 'overview' && stats && (
                    <>
                        {/* Stats Cards */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ background: '#DBEAFE', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '1rem' }}><Users size={28} color="#2563EB" /></div>
                                <p style={{ fontSize: '2.2rem', fontWeight: 950 }}>{stats.totalUsers}</p>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Average Users</p>
                            </div>
                            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ background: '#DCFCE7', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '1rem' }}><Map size={28} color="#16A34A" /></div>
                                <p style={{ fontSize: '2.2rem', fontWeight: 950 }}>{stats.totalTrips}</p>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Popular Trips</p>
                            </div>
                            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ background: '#FEF3C7', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '1rem' }}><MapPin size={28} color="#D97706" /></div>
                                <p style={{ fontSize: '2.2rem', fontWeight: 950 }}>{stats.totalStops}</p>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>Popular Cities</p>
                            </div>
                            <div className="premium-card" style={{ padding: '2rem', textAlign: 'center' }}>
                                <div style={{ background: '#FCE7F3', padding: '14px', borderRadius: '16px', display: 'inline-flex', marginBottom: '1rem' }}><DollarSign size={28} color="#DB2777" /></div>
                                <p style={{ fontSize: '2.2rem', fontWeight: 950 }}>₹{Number(stats.totalRevenue).toLocaleString()}</p>
                                <p style={{ color: 'var(--text-muted)', fontWeight: 600, fontSize: '0.85rem' }}>User Trends and Analytics</p>
                            </div>
                        </div>

                        {/* Charts placeholder — Visual bar chart from real data */}
                        <div className="premium-card" style={{ padding: '3rem', marginBottom: '3rem' }}>
                            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Popular Destinations</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {cities.length > 0 ? cities.map((city, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ width: '150px', fontWeight: 700, fontSize: '0.9rem' }}>{city.city_name}</span>
                                        <div style={{ flex: 1, background: '#F1F5F9', borderRadius: '8px', height: '32px', overflow: 'hidden' }}>
                                            <div style={{ 
                                                width: `${Math.min((city.visit_count / (cities[0]?.visit_count || 1)) * 100, 100)}%`, 
                                                height: '100%', 
                                                background: 'var(--primary-gradient)', 
                                                borderRadius: '8px',
                                                transition: 'width 1s ease'
                                            }} />
                                        </div>
                                        <span style={{ fontWeight: 800, fontSize: '0.85rem', color: 'var(--primary)' }}>{city.visit_count} visits</span>
                                    </div>
                                )) : (
                                    <p style={{ color: 'var(--text-muted)' }}>No destination data yet.</p>
                                )}
                            </div>
                        </div>

                        {/* Popular Activities */}
                        {activities.length > 0 && (
                            <div className="premium-card" style={{ padding: '3rem' }}>
                                <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>Popular Activities</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
                                    {activities.map((act, i) => (
                                        <div key={i} style={{ background: '#F8FAFC', padding: '1.5rem', borderRadius: '16px', textAlign: 'center' }}>
                                            <Activity size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                                            <p style={{ fontWeight: 800, marginBottom: '4px' }}>{act.type || 'General'}</p>
                                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{act.count} activities · Avg ₹{act.avg_cost}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </>
                )}

                {activeTab === 'users' && (
                    <div className="premium-card" style={{ padding: '2.5rem', background: 'white' }}>
                        <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>User Management</h3>
                        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                            <thead>
                                <tr style={{ textAlign: 'left', borderBottom: '2px solid #F1F5F9', color: 'var(--text-muted)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                    <th style={{ padding: '1rem 0' }}>User</th>
                                    <th style={{ padding: '1rem' }}>Email</th>
                                    <th style={{ padding: '1rem' }}>Location</th>
                                    <th style={{ padding: '1rem' }}>Trips</th>
                                    <th style={{ padding: '1rem' }}>Role</th>
                                    <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map(u => (
                                    <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                        <td style={{ padding: '1.2rem 0' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                <img src={`https://ui-avatars.com/api/?name=${u.first_name}+${u.last_name}&background=00B8D4&color=fff&size=40`} style={{ width: '36px', height: '36px', borderRadius: '10px' }} alt="" />
                                                <span style={{ fontWeight: 700 }}>{u.first_name} {u.last_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ padding: '1.2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>{u.email}</td>
                                        <td style={{ padding: '1.2rem', fontSize: '0.9rem' }}>{u.city || '—'}, {u.country || '—'}</td>
                                        <td style={{ padding: '1.2rem' }}><span style={{ background: '#DBEAFE', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8' }}>{u.trip_count}</span></td>
                                        <td style={{ padding: '1.2rem' }}>
                                            <span style={{ padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, background: u.role === 'admin' ? '#FEF3C7' : '#F1F5F9', color: u.role === 'admin' ? '#92400E' : '#64748B' }}>
                                                {u.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                            {u.role !== 'admin' && (
                                                <button onClick={() => deleteUser(u.id)} style={{ background: '#FEF2F2', border: 'none', color: 'var(--error)', padding: '8px', borderRadius: '8px', cursor: 'pointer' }}>
                                                    <Trash2 size={16} />
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'insights' && (
                    <div style={{ display: 'grid', gap: '2rem' }}>
                        <div className="premium-card" style={{ padding: '3rem' }}>
                            <h3 style={{ fontWeight: 800, marginBottom: '2rem' }}>City Popularity Breakdown</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1.5rem' }}>
                                {cities.map((city, i) => (
                                    <div key={i} style={{ background: '#F8FAFC', padding: '2rem', borderRadius: '20px', textAlign: 'center' }}>
                                        <MapPin size={24} color="var(--primary)" style={{ marginBottom: '0.5rem' }} />
                                        <p style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: '4px' }}>{city.city_name}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{city.country || 'Unknown'}</p>
                                        <p style={{ fontWeight: 900, fontSize: '1.5rem', color: 'var(--primary)', marginTop: '0.5rem' }}>{city.visit_count}</p>
                                        <p style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>Total Visits</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default AdminPanel;
