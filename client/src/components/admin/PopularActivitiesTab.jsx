import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Activity, DollarSign, Clock, Zap } from 'lucide-react';
import '../../styles/AdminPanel.css';

const COLORS = ['#0077B6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];
const TYPE_ICONS = { 'Sightseeing': '🏛️', 'Food': '🍜', 'Adventure': '🧗', 'Shopping': '🛍️', 'Transport': '🚌', 'Culture': '🎭', 'Nature': '🌿', 'Beach': '🏖️', 'Nightlife': '🌃', 'Other': '📌' };

const PopularActivitiesTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('adminToken');
            try {
                const res = await axios.get('/api/admin/popular-activities', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setData(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>{[1,2,3].map(i => <div key={i} className="admin-skeleton" style={{ height: 100, marginBottom: 12 }} />)}</div>;
    if (!data?.totalActivities) return (
        <div className="admin-empty-state"><Activity size={64} /><h3>No Activity Data Yet</h3><p>Activities will appear once users add them to their trips.</p></div>
    );

    const maxCount = Math.max(...(data.typeDistribution?.map(t => t.count) || [1]), 1);

    return (
        <div className="animate-fade-in">
            {/* Summary Stats */}
            <div className="admin-grid-4" style={{ marginBottom: '2rem' }}>
                {[
                    { label: 'Total Activities', value: data.totalActivities, icon: <Activity size={20} />, color: '#0077B6', bg: '#EFF6FF' },
                    { label: 'Activity Types', value: data.typeDistribution?.length || 0, icon: <Zap size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
                    { label: 'Avg Cost', value: `₹${data.costStats?.avgCost || 0}`, icon: <DollarSign size={20} />, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Total Spent', value: `₹${(data.costStats?.totalCost || 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
                ].map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                        <div className="admin-stat-value" style={{ fontSize: '1.5rem' }}>{s.value}</div>
                        <div className="admin-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                {/* Type Distribution - Donut */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">Activity Type Distribution</div><div className="admin-card-subtitle">Breakdown by category</div></div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
                        <div className="admin-donut-chart" style={{
                            background: `conic-gradient(${data.typeDistribution.map((t, i) => {
                                const start = data.typeDistribution.slice(0, i).reduce((s, x) => s + x.percentage, 0) * 3.6;
                                const end = start + t.percentage * 3.6;
                                return `${COLORS[i % 10]} ${start}deg ${end}deg`;
                            }).join(', ')})`,
                            flexShrink: 0
                        }}>
                            <div className="admin-donut-center">
                                <div className="admin-donut-center-value">{data.totalActivities}</div>
                                <div className="admin-donut-center-label">Total</div>
                            </div>
                        </div>
                        <div className="admin-chart-legend">
                            {data.typeDistribution.map((t, i) => (
                                <div key={i} className="admin-legend-item">
                                    <div className="admin-legend-dot" style={{ background: COLORS[i % 10] }} />
                                    <span>{TYPE_ICONS[t.type] || '📌'} {t.type}</span>
                                    <span className="admin-legend-value">{t.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Type Bar Chart */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">Activity Frequency</div><div className="admin-card-subtitle">Count by type</div></div>
                    </div>
                    <div className="admin-bar-chart" style={{ marginBottom: '2rem' }}>
                        {data.typeDistribution.map((t, i) => (
                            <div key={i} className="admin-bar" style={{
                                height: `${(t.count / maxCount) * 100}%`, minHeight: '8px',
                                background: `linear-gradient(180deg, ${COLORS[i % 10]}, ${COLORS[i % 10]}99)`
                            }}>
                                <span className="admin-bar-value">{t.count}</span>
                                <span className="admin-bar-label">{t.type?.substring(0, 6)}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Activity Type Cards */}
            <div className="admin-card">
                <div className="admin-card-header">
                    <div><div className="admin-card-title">Activity Types Detail</div><div className="admin-card-subtitle">Comprehensive breakdown per category</div></div>
                </div>
                <div className="admin-grid-3">
                    {data.typeDistribution.map((t, i) => (
                        <div key={i} style={{
                            background: '#F9FAFB', borderRadius: 16, padding: '1.5rem',
                            border: '1px solid #F3F4F6', transition: 'all 0.3s ease'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                <span style={{ fontSize: '1.6rem' }}>{TYPE_ICONS[t.type] || '📌'}</span>
                                <span className="admin-badge" style={{ background: `${COLORS[i % 10]}15`, color: COLORS[i % 10] }}>{t.percentage}%</span>
                            </div>
                            <h4 style={{ marginBottom: '0.8rem', fontWeight: 800 }}>{t.type}</h4>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem' }}>
                                <div><div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Count</div><div style={{ fontWeight: 800, fontSize: '1.1rem' }}>{t.count}</div></div>
                                <div><div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Avg Cost</div><div style={{ fontWeight: 800, fontSize: '1.1rem', color: '#059669' }}>₹{t.avg_cost}</div></div>
                            </div>
                            {/* Mini bar indicator */}
                            <div style={{ marginTop: '1rem', height: 6, background: '#E5E7EB', borderRadius: 10, overflow: 'hidden' }}>
                                <div style={{ height: '100%', width: `${t.percentage}%`, background: COLORS[i % 10], borderRadius: 10, transition: 'width 1s ease' }} />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Activities Table */}
            {data.topActivities?.length > 0 && (
                <div className="admin-card" style={{ marginTop: '1.5rem', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 1.5rem 0' }}>
                        <div className="admin-card-title">Top Activities by Frequency</div>
                        <div className="admin-card-subtitle">Most popular individual activities</div>
                    </div>
                    <table className="admin-table" style={{ marginTop: '1rem' }}>
                        <thead><tr><th>Activity</th><th>Type</th><th>Frequency</th><th>Avg Cost</th></tr></thead>
                        <tbody>
                            {data.topActivities.slice(0, 10).map((a, i) => (
                                <tr key={i}>
                                    <td>{a.name}</td>
                                    <td><span className="admin-badge blue">{TYPE_ICONS[a.type] || '📌'} {a.type || 'Other'}</span></td>
                                    <td><strong>{a.frequency}</strong></td>
                                    <td style={{ color: '#059669', fontWeight: 700 }}>₹{a.avg_cost}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default PopularActivitiesTab;
