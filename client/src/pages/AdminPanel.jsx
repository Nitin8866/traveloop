import React, { useState } from 'react';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    Users, Map, Activity, TrendingUp, Search, SlidersHorizontal, 
    LayoutGrid, Trash2, Eye, MoreVertical, CheckCircle, XCircle 
} from 'lucide-react';

const AdminPanel = () => {
    const [activeTab, setActiveTab] = useState('users');

    const users = [
        { id: 1, name: 'Don Gabriel', email: 'don@example.com', trips: 12, status: 'Active', role: 'user' },
        { id: 2, name: 'Manoj Kumar', email: 'manoj@example.com', trips: 8, status: 'Active', role: 'user' },
        { id: 3, name: 'Nitin Maharaj', email: 'nitin@example.com', trips: 25, status: 'Admin', role: 'admin' },
    ];

    const popularCities = [
        { name: 'Paris', visits: 1240, trend: '+12%', color: '#00B8D4' },
        { name: 'Tokyo', visits: 980, trend: '+8%', color: '#0077B6' },
        { name: 'Rome', visits: 850, trend: '+5%', color: '#6366F1' },
    ];

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Platform Overview</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Real-time metrics and management tools for Traveloop.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}>Download Report</button>
                        <button className="btn-primary">+ Add System Activity</button>
                    </div>
                </div>

                {/* Performance Stats Cards */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                    {[
                        { label: 'Total Users', value: '45.2k', change: '+12%', icon: <Users /> },
                        { label: 'Active Trips', value: '1,240', change: '+5%', icon: <Map /> },
                        { label: 'Revenue', value: '$84,200', change: '+18%', icon: <Activity /> },
                        { label: 'Engagement', value: '94%', change: '+2%', icon: <TrendingUp /> },
                    ].map((stat, i) => (
                        <div key={i} className="premium-card" style={{ padding: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                <div style={{ color: 'var(--primary)', background: 'rgba(0,184,212,0.1)', padding: '10px', borderRadius: '12px' }}>{stat.icon}</div>
                                <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.8rem' }}>{stat.change}</span>
                            </div>
                            <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '4px' }}>{stat.label}</p>
                            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>{stat.value}</h2>
                        </div>
                    ))}
                </div>

                {/* Interactive Task Sections (Matches Wireframe) */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '2rem' }}>
                    {[
                        { id: 'users', label: 'Manage Users', icon: <Users size={16} /> },
                        { id: 'cities', label: 'Popular Cities', icon: <Map size={16} /> },
                        { id: 'activities', label: 'Popular Activities', icon: <Activity size={16} /> },
                        { id: 'analytics', label: 'Trends & Analytics', icon: <TrendingUp size={16} /> },
                    ].map(tab => (
                        <button 
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{ 
                                display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 20px', borderRadius: '10px', border: '1px solid #E5E7EB', fontWeight: 700, cursor: 'pointer',
                                background: activeTab === tab.id ? '#1A1D21' : 'white',
                                color: activeTab === tab.id ? 'white' : 'var(--text-muted)',
                                transition: '0.3s'
                            }}
                        >
                            {tab.icon} {tab.label}
                        </button>
                    ))}
                </div>

                <div className="premium-card" style={{ padding: '2.5rem' }}>
                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                                <h3 style={{ margin: 0 }}>Registered Users</h3>
                                <div style={{ display: 'flex', gap: '1rem' }}>
                                    <div style={{ position: 'relative' }}>
                                        <Search size={14} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                                        <input type="text" placeholder="Filter users..." style={{ padding: '8px 12px 8px 32px', fontSize: '0.85rem' }} />
                                    </div>
                                    <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee' }}><SlidersHorizontal size={14} /></button>
                                </div>
                            </div>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #F9FAFB', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Trips</th>
                                        <th style={{ padding: '1rem' }}>Role</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                            <td style={{ padding: '1.2rem' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                                    <img src={`https://ui-avatars.com/api/?name=${u.name}&background=00B8D4&color=fff`} style={{ width: '32px', height: '32px', borderRadius: '8px' }} />
                                                    <p style={{ fontWeight: 700 }}>{u.name}</p>
                                                </div>
                                            </td>
                                            <td style={{ padding: '1.2rem', fontWeight: 700 }}>{u.trips}</td>
                                            <td style={{ padding: '1.2rem' }}><span style={{ color: u.role === 'admin' ? 'var(--primary)' : 'inherit', fontWeight: u.role === 'admin' ? 800 : 400 }}>{u.role}</span></td>
                                            <td style={{ padding: '1.2rem' }}><span style={{ color: '#10B981', fontWeight: 800 }}>Active</span></td>
                                            <td style={{ padding: '1.2rem', textAlign: 'right' }}>
                                                <button style={{ padding: '8px', borderRadius: '10px', border: '1px solid #eee', color: 'var(--error)', background: '#FEF2F2' }}><Trash2 size={16} /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                    
                    {activeTab === 'analytics' && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '3rem' }}>
                             <div style={{ height: '300px', width: '100%', background: '#F9FAFB', borderRadius: '24px', display: 'flex', alignItems: 'flex-end', padding: '2rem', gap: '15px' }}>
                                {[40, 70, 45, 90, 60, 100, 80, 50].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary-gradient)', borderRadius: '8px 8px 0 0' }}></div>
                                ))}
                             </div>
                             <p style={{ marginTop: '2rem', color: 'var(--text-muted)' }}>System-wide engagement metrics across 12 months.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPanel;
