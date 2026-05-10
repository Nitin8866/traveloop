import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, Globe, Users, Filter } from 'lucide-react';
import '../../styles/AdminPanel.css';

const COLORS = ['#0077B6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#6366F1'];

const PopularCitiesTab = () => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [countryFilter, setCountryFilter] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            const token = localStorage.getItem('adminToken');
            try {
                const res = await axios.get('/api/admin/popular-cities', {
                    headers: { Authorization: `Bearer ${token}` },
                    params: { country: countryFilter }
                });
                setData(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, [countryFilter]);

    if (loading) return <div>{[1,2,3].map(i => <div key={i} className="admin-skeleton" style={{ height: 80, marginBottom: 12 }} />)}</div>;
    if (!data?.cities?.length) return (
        <div className="admin-empty-state">
            <MapPin size={64} />
            <h3>No City Data Yet</h3>
            <p>Cities will appear here once users start creating trips with stops.</p>
        </div>
    );

    const maxVisits = Math.max(...data.cities.map(c => c.visit_count), 1);

    return (
        <div className="animate-fade-in">
            {/* Filter Bar */}
            <div className="admin-toolbar">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Filter size={18} color="#6B7280" />
                    <select value={countryFilter} onChange={e => setCountryFilter(e.target.value)} className="admin-filter-btn" style={{ appearance: 'auto' }}>
                        <option value="">All Countries</option>
                        {(data.countries || []).map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                <span style={{ color: '#6B7280', fontSize: '0.85rem', marginLeft: 'auto' }}>
                    Total: <strong>{data.totalVisits}</strong> city visits across <strong>{data.cities.length}</strong> cities
                </span>
            </div>

            <div className="admin-grid-2">
                {/* Bar Chart */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <div className="admin-card-title">City Visit Rankings</div>
                            <div className="admin-card-subtitle">Top destinations by visit count</div>
                        </div>
                    </div>
                    <div className="admin-hbar-chart">
                        {data.cities.slice(0, 10).map((c, i) => (
                            <div key={i} className="admin-hbar-row">
                                <div className="admin-hbar-label">{c.city_name}</div>
                                <div className="admin-hbar-track">
                                    <div className="admin-hbar-fill" style={{
                                        width: `${Math.max((c.visit_count / maxVisits) * 100, 8)}%`,
                                        background: `linear-gradient(135deg, ${COLORS[i % 10]}, ${COLORS[(i + 1) % 10]})`
                                    }}>
                                        {c.visit_count} visits
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Donut Chart */}
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div>
                            <div className="admin-card-title">Visit Distribution</div>
                            <div className="admin-card-subtitle">Percentage breakdown by city</div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', justifyContent: 'center' }}>
                        <div className="admin-donut-chart" style={{
                            background: `conic-gradient(${data.cities.slice(0, 8).map((c, i) => {
                                const start = data.cities.slice(0, i).reduce((s, x) => s + x.percentage, 0) * 3.6;
                                const end = start + c.percentage * 3.6;
                                return `${COLORS[i % 10]} ${start}deg ${end}deg`;
                            }).join(', ')}${data.cities.length > 8 ? `, #D1D5DB ${data.cities.slice(0, 8).reduce((s, c) => s + c.percentage, 0) * 3.6}deg 360deg` : ''})`,
                            flexShrink: 0
                        }}>
                            <div className="admin-donut-center">
                                <div className="admin-donut-center-value">{data.cities.length}</div>
                                <div className="admin-donut-center-label">Cities</div>
                            </div>
                        </div>
                        <div className="admin-chart-legend">
                            {data.cities.slice(0, 8).map((c, i) => (
                                <div key={i} className="admin-legend-item">
                                    <div className="admin-legend-dot" style={{ background: COLORS[i % 10] }} />
                                    <span style={{ fontSize: '0.82rem' }}>{c.city_name}</span>
                                    <span className="admin-legend-value">{c.percentage}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* City Cards Grid */}
            <div className="admin-grid-3" style={{ marginTop: '1.5rem' }}>
                {data.cities.map((c, i) => (
                    <div key={i} className="admin-city-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                                    <MapPin size={16} color={COLORS[i % 10]} />
                                    <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>{c.city_name}</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B7280', fontSize: '0.82rem' }}>
                                    <Globe size={13} /> {c.country || 'Unknown'}
                                </div>
                            </div>
                            <span style={{
                                background: `linear-gradient(135deg, ${COLORS[i % 10]}15, ${COLORS[i % 10]}25)`,
                                color: COLORS[i % 10], padding: '4px 12px', borderRadius: 20,
                                fontWeight: 900, fontSize: '0.8rem'
                            }}>
                                #{i + 1}
                            </span>
                        </div>
                        <div style={{ display: 'flex', gap: '1rem' }}>
                            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{c.visit_count}</div>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Visits</div>
                            </div>
                            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{c.unique_visitors}</div>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Visitors</div>
                            </div>
                            <div style={{ flex: 1, background: '#F9FAFB', borderRadius: 12, padding: '10px 14px', textAlign: 'center' }}>
                                <div style={{ fontSize: '1.2rem', fontWeight: 900 }}>{c.percentage}%</div>
                                <div style={{ fontSize: '0.65rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>Share</div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default PopularCitiesTab;
