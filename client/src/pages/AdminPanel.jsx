import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import AdminLayout from '../components/layout/AdminLayout';
import { 
    Users, Map, Activity, TrendingUp, Search, SlidersHorizontal, 
    LayoutGrid, Trash2, Eye, MoreVertical, CheckCircle, XCircle, 
    ShieldAlert, Database, Settings
} from 'lucide-react';

const AdminPanel = () => {
    const location = useLocation();
    const [activeTab, setActiveTab] = useState('overview');

    // Sync active tab with URL path
    useEffect(() => {
        const path = location.pathname;
        if (path.includes('users')) setActiveTab('users');
        else if (path.includes('destinations')) setActiveTab('destinations');
        else if (path.includes('health')) setActiveTab('health');
        else if (path.includes('settings')) setActiveTab('settings');
        else setActiveTab('overview');
    }, [location]);

    const users = [
        { id: 1, name: 'Don Gabriel', email: 'don@example.com', trips: 12, status: 'Active' },
        { id: 2, name: 'Manoj Kumar', email: 'manoj@example.com', trips: 8, status: 'Active' },
    ];

    return (
        <AdminLayout>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                            {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Control
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Manage platform {activeTab} and system integrity.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button className="btn-primary" style={{ background: 'white', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}>Export Data</button>
                        <button className="btn-primary">Update System</button>
                    </div>
                </div>

                {/* Conditional Content based on Sidebar/Tab */}
                <div className="premium-card" style={{ padding: '2.5rem' }}>
                    {activeTab === 'overview' && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '2.5rem' }}>Platform Statistics</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
                                {[
                                    { label: 'Total Users', value: '45.2k', change: '+12%', icon: <Users /> },
                                    { label: 'Active Trips', value: '1,240', change: '+5%', icon: <Map /> },
                                    { label: 'Revenue', value: '$84,200', change: '+18%', icon: <Activity /> },
                                    { label: 'Engagement', value: '94%', change: '+2%', icon: <TrendingUp /> },
                                ].map((stat, i) => (
                                    <div key={i} style={{ padding: '1.5rem', background: '#F9FAFB', borderRadius: '20px' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                            <div style={{ color: 'var(--primary)' }}>{stat.icon}</div>
                                            <span style={{ color: 'var(--accent)', fontWeight: 800, fontSize: '0.75rem' }}>{stat.change}</span>
                                        </div>
                                        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</p>
                                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900 }}>{stat.value}</h2>
                                    </div>
                                ))}
                            </div>
                            <div style={{ height: '200px', width: '100%', background: '#f8f9fa', borderRadius: '20px', display: 'flex', alignItems: 'flex-end', padding: '1rem', gap: '10px' }}>
                                {[20, 50, 30, 80, 45, 90, 60, 100].map((h, i) => (
                                    <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary-gradient)', borderRadius: '6px' }}></div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'users' && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '2rem' }}>User Directory</h3>
                            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                    <tr style={{ textAlign: 'left', borderBottom: '2px solid #F9FAFB', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                                        <th style={{ padding: '1rem' }}>Name</th>
                                        <th style={{ padding: '1rem' }}>Trips</th>
                                        <th style={{ padding: '1rem' }}>Status</th>
                                        <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u.id} style={{ borderBottom: '1px solid #F9FAFB' }}>
                                            <td style={{ padding: '1.2rem', fontWeight: 700 }}>{u.name}</td>
                                            <td style={{ padding: '1.2rem' }}>{u.trips}</td>
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

                    {activeTab === 'destinations' && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
                            <div style={{ background: '#F0F9FF', color: 'var(--primary)', width: '80px', height: '80px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <Map size={40} />
                            </div>
                            <h3 style={{ marginBottom: '1rem' }}>Global Destination Tracking</h3>
                            <p style={{ color: 'var(--text-muted)', maxWidth: '400px', margin: '0 auto' }}>Monitor and update the world's top travel spots based on real-time user searches and bookings.</p>
                        </div>
                    )}

                    {activeTab === 'health' && (
                        <div className="animate-fade-in">
                            <h3 style={{ marginBottom: '2rem' }}>System Health Monitor</h3>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
                                <div style={{ padding: '2rem', background: '#F0FDF4', borderRadius: '24px', border: '1px solid #DCFCE7' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                        <Database color="#166534" /> <h4 style={{ color: '#166534' }}>Database Status</h4>
                                    </div>
                                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#166534' }}>Connected & Secure</p>
                                </div>
                                <div style={{ padding: '2rem', background: '#FFF7ED', borderRadius: '24px', border: '1px solid #FFEDD5' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1rem' }}>
                                        <ShieldAlert color="#9A3412" /> <h4 style={{ color: '#9A3412' }}>Security Logs</h4>
                                    </div>
                                    <p style={{ fontWeight: 800, fontSize: '1.2rem', color: '#9A3412' }}>0 Critical Threats</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'settings' && (
                        <div className="animate-fade-in" style={{ textAlign: 'center', padding: '4rem' }}>
                            <Settings size={64} color="#ddd" style={{ marginBottom: '2rem' }} />
                            <h3>Admin Configurations</h3>
                            <p style={{ color: 'var(--text-muted)' }}>Customize platform-wide variables and authentication protocols.</p>
                        </div>
                    )}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPanel;
