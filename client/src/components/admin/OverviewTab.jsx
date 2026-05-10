import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Users, Map, TrendingUp, DollarSign, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import '../../styles/AdminPanel.css';

const CHART_COLORS = ['#0077B6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const OverviewTab = () => {
    const [stats, setStats] = useState(null);
    const [trends, setTrends] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('adminToken');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [statsRes, trendsRes] = await Promise.all([
                    axios.get('/api/admin/stats', { headers }),
                    axios.get('/api/admin/trends', { headers })
                ]);
                setStats(statsRes.data);
                setTrends(trendsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <LoadingSkeleton />;

    const statCards = [
        { label: 'Total Users', value: stats?.totalUsers || 0, icon: <Users size={22} />, color: '#0077B6', bg: '#EFF6FF', change: stats?.recentSignups || 0, changeLabel: 'new this month' },
        { label: 'Total Trips', value: stats?.totalTrips || 0, icon: <Map size={22} />, color: '#10B981', bg: '#ECFDF5', change: stats?.recentTrips || 0, changeLabel: 'new this month' },
        { label: 'Activities', value: stats?.totalActivities || 0, icon: <TrendingUp size={22} />, color: '#8B5CF6', bg: '#F5F3FF', change: `${stats?.avgTripsPerUser || 0} avg/user`, changeLabel: 'trips per user' },
        { label: 'Total Revenue', value: `₹${(stats?.totalExpenses || 0).toLocaleString()}`, icon: <DollarSign size={22} />, color: '#F59E0B', bg: '#FFFBEB', change: `₹${stats?.avgExpensePerTrip || 0} avg`, changeLabel: 'per trip' },
    ];

    const maxTrend = Math.max(...(trends?.tripCreationTrend?.map(t => t.count) || [1]), 1);
    const maxSignup = Math.max(...(trends?.userSignupTrend?.map(t => t.count) || [1]), 1);

    return (
        <div className="animate-fade-in">
            <div className="admin-grid-4" style={{ marginBottom: '2rem' }}>
                {statCards.map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                            <span className="admin-stat-change positive"><ArrowUpRight size={12} /> {s.change}</span>
                        </div>
                        <div className="admin-stat-value">{s.value}</div>
                        <div className="admin-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">Trip Creation Trend</div><div className="admin-card-subtitle">Monthly trips over last 12 months</div></div>
                    </div>
                    <div className="admin-bar-chart" style={{ marginBottom: '2rem' }}>
                        {(trends?.tripCreationTrend || []).map((t, i) => (
                            <div key={i} className="admin-bar" style={{ height: `${(t.count / maxTrend) * 100}%`, minHeight: '4px' }}>
                                <span className="admin-bar-value">{t.count}</span>
                                <span className="admin-bar-label">{t.label?.split(' ')[0]}</span>
                            </div>
                        ))}
                        {(!trends?.tripCreationTrend?.length) && <div style={{ flex: 1, textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>No data yet</div>}
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">User Signup Trend</div><div className="admin-card-subtitle">New registrations over last 12 months</div></div>
                    </div>
                    <div className="admin-line-chart">
                        {(trends?.userSignupTrend || []).map((t, i) => (
                            <div key={i} className="admin-line-point" style={{ height: '100%' }}>
                                <div style={{ flex: 1 }} />
                                <div className="admin-line-dot" title={`${t.label}: ${t.count}`} style={{ marginBottom: `${(t.count / maxSignup) * 140}px` }} />
                                <div className="admin-line-stem" style={{ height: `${(t.count / maxSignup) * 140}px` }} />
                                <span style={{ position: 'absolute', bottom: '4px', fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600 }}>{t.label?.split(' ')[0]}</span>
                            </div>
                        ))}
                        {(!trends?.userSignupTrend?.length) && <div style={{ flex: 1, textAlign: 'center', color: '#9CA3AF', padding: '2rem' }}>No data yet</div>}
                    </div>
                </div>
            </div>

            <div className="admin-grid-2">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">Expense Categories</div><div className="admin-card-subtitle">Platform-wide spending distribution</div></div>
                    </div>
                    {trends?.expenseCategories?.length ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div className="admin-donut-chart" style={{ background: `conic-gradient(${trends.expenseCategories.map((c, i) => {
                                const start = trends.expenseCategories.slice(0, i).reduce((s, x) => s + (x.total_amount / trends.expenseCategories.reduce((a, b) => a + b.total_amount, 1)) * 360, 0);
                                const end = start + (c.total_amount / trends.expenseCategories.reduce((a, b) => a + b.total_amount, 1)) * 360;
                                return `${CHART_COLORS[i % 8]} ${start}deg ${end}deg`;
                            }).join(', ')})`, flexShrink: 0 }}>
                                <div className="admin-donut-center">
                                    <div className="admin-donut-center-value">{trends.expenseCategories.length}</div>
                                    <div className="admin-donut-center-label">Categories</div>
                                </div>
                            </div>
                            <div className="admin-chart-legend">
                                {trends.expenseCategories.map((c, i) => (
                                    <div key={i} className="admin-legend-item">
                                        <div className="admin-legend-dot" style={{ background: CHART_COLORS[i % 8] }} />
                                        <span>{c.category}</span>
                                        <span className="admin-legend-value">₹{c.total_amount?.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <div className="admin-empty-state"><p>No expense data yet</p></div>}
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">Recent Signups</div><div className="admin-card-subtitle">Latest registered users</div></div>
                    </div>
                    <div className="admin-scrollable">
                        {(stats?.recentUsers || []).map((u, i) => (
                            <div key={i} className="admin-leaderboard-item">
                                <img src={`https://ui-avatars.com/api/?name=${u.first_name}+${u.last_name}&background=EFF6FF&color=0077B6&bold=true`} style={{ width: 40, height: 40, borderRadius: 12 }} alt="" />
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.first_name} {u.last_name}</div>
                                    <div style={{ fontSize: '0.75rem', color: '#9CA3AF' }}>{u.email}</div>
                                </div>
                                <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
                                    <div style={{ fontSize: '0.75rem', color: '#6B7280' }}>{u.city || 'N/A'}, {u.country || 'N/A'}</div>
                                    <div style={{ fontSize: '0.7rem', color: '#9CA3AF' }}>{new Date(u.created_at).toLocaleDateString()}</div>
                                </div>
                            </div>
                        ))}
                        {!stats?.recentUsers?.length && <div className="admin-empty-state"><p>No users yet</p></div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

const LoadingSkeleton = () => (
    <div>
        <div className="admin-grid-4" style={{ marginBottom: '2rem' }}>
            {[1,2,3,4].map(i => <div key={i} className="admin-skeleton" style={{ height: 140 }} />)}
        </div>
        <div className="admin-grid-2">
            {[1,2].map(i => <div key={i} className="admin-skeleton" style={{ height: 300 }} />)}
        </div>
    </div>
);

export default OverviewTab;
