import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { TrendingUp, Calendar, DollarSign, Users, Clock, Trophy, BarChart3 } from 'lucide-react';
import '../../styles/AdminPanel.css';

const COLORS = ['#0077B6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16'];

const TrendsTab = () => {
    const [trends, setTrends] = useState(null);
    const [expenses, setExpenses] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('adminToken');
            const headers = { Authorization: `Bearer ${token}` };
            try {
                const [trendsRes, expensesRes] = await Promise.all([
                    axios.get('/api/admin/trends', { headers }),
                    axios.get('/api/admin/expense-analytics', { headers })
                ]);
                setTrends(trendsRes.data);
                setExpenses(expensesRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, []);

    if (loading) return <div>{[1,2,3,4].map(i => <div key={i} className="admin-skeleton" style={{ height: 120, marginBottom: 12 }} />)}</div>;

    const maxTrips = Math.max(...(trends?.tripCreationTrend?.map(t => t.count) || [1]), 1);
    const maxSignups = Math.max(...(trends?.userSignupTrend?.map(t => t.count) || [1]), 1);
    const maxExpTrend = Math.max(...(expenses?.monthlyTrend?.map(t => t.total) || [1]), 1);
    const totalExpCat = expenses?.categoryBreakdown?.reduce((s, c) => s + c.total, 0) || 1;

    return (
        <div className="animate-fade-in">
            {/* Summary Row */}
            <div className="admin-grid-4" style={{ marginBottom: '2rem' }}>
                {[
                    { label: 'Avg Trip Duration', value: `${trends?.durationStats?.avgDuration || 0} days`, icon: <Clock size={20} />, color: '#0077B6', bg: '#EFF6FF' },
                    { label: 'Total Platform Spend', value: `$${(expenses?.overallStats?.totalSpending || 0).toLocaleString()}`, icon: <DollarSign size={20} />, color: '#10B981', bg: '#ECFDF5' },
                    { label: 'Trips with Expenses', value: expenses?.overallStats?.tripsWithExpenses || 0, icon: <BarChart3 size={20} />, color: '#F59E0B', bg: '#FFFBEB' },
                    { label: 'Expense Entries', value: expenses?.overallStats?.totalEntries || 0, icon: <TrendingUp size={20} />, color: '#8B5CF6', bg: '#F5F3FF' },
                ].map((s, i) => (
                    <div key={i} className="admin-stat-card">
                        <div className="admin-stat-icon" style={{ background: s.bg, color: s.color }}>{s.icon}</div>
                        <div className="admin-stat-value" style={{ fontSize: '1.4rem' }}>{s.value}</div>
                        <div className="admin-stat-label">{s.label}</div>
                    </div>
                ))}
            </div>

            {/* User Signup Trend + Trip Creation Trend */}
            <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">📈 User Registration Trend</div><div className="admin-card-subtitle">Monthly new signups (last 12 months)</div></div>
                    </div>
                    {trends?.userSignupTrend?.length ? (
                        <div className="admin-line-chart">
                            {trends.userSignupTrend.map((t, i) => (
                                <div key={i} className="admin-line-point">
                                    <div style={{ flex: 1 }} />
                                    <div className="admin-line-dot" title={`${t.label}: ${t.count} users`}
                                        style={{ marginBottom: `${(t.count / maxSignups) * 140}px`, background: '#0077B6' }} />
                                    <div className="admin-line-stem" style={{ height: `${(t.count / maxSignups) * 140}px` }} />
                                    <span style={{ position: 'absolute', bottom: '4px', fontSize: '0.6rem', color: '#9CA3AF', fontWeight: 600 }}>{t.label?.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    ) : <div className="admin-empty-state" style={{ padding: '2rem' }}><p>No signup data</p></div>}
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">📊 Trip Creation Trend</div><div className="admin-card-subtitle">Monthly trips created (last 12 months)</div></div>
                    </div>
                    {trends?.tripCreationTrend?.length ? (
                        <div className="admin-bar-chart" style={{ marginBottom: '2rem' }}>
                            {trends.tripCreationTrend.map((t, i) => (
                                <div key={i} className="admin-bar" style={{ height: `${(t.count / maxTrips) * 100}%`, minHeight: '8px',
                                    background: `linear-gradient(180deg, #10B981, #10B98199)` }}>
                                    <span className="admin-bar-value">{t.count}</span>
                                    <span className="admin-bar-label">{t.label?.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    ) : <div className="admin-empty-state" style={{ padding: '2rem' }}><p>No trip data</p></div>}
                </div>
            </div>

            {/* Expense Breakdown + Monthly Trend */}
            <div className="admin-grid-2" style={{ marginBottom: '2rem' }}>
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">💰 Expense Category Breakdown</div><div className="admin-card-subtitle">Where money is being spent</div></div>
                    </div>
                    {expenses?.categoryBreakdown?.length ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                            <div className="admin-donut-chart" style={{
                                background: `conic-gradient(${expenses.categoryBreakdown.map((c, i) => {
                                    const start = expenses.categoryBreakdown.slice(0, i).reduce((s, x) => s + (x.total / totalExpCat) * 360, 0);
                                    const end = start + (c.total / totalExpCat) * 360;
                                    return `${COLORS[i % 8]} ${start}deg ${end}deg`;
                                }).join(', ')})`, flexShrink: 0
                            }}>
                                <div className="admin-donut-center">
                                    <div className="admin-donut-center-value">${(expenses.overallStats?.totalSpending || 0).toLocaleString()}</div>
                                    <div className="admin-donut-center-label">Total</div>
                                </div>
                            </div>
                            <div className="admin-chart-legend">
                                {expenses.categoryBreakdown.map((c, i) => (
                                    <div key={i} className="admin-legend-item">
                                        <div className="admin-legend-dot" style={{ background: COLORS[i % 8] }} />
                                        <span>{c.category}</span>
                                        <span className="admin-legend-value">${c.total.toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : <div className="admin-empty-state" style={{ padding: '2rem' }}><p>No expense data</p></div>}
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">📅 Monthly Expense Trend</div><div className="admin-card-subtitle">Spending over last 12 months</div></div>
                    </div>
                    {expenses?.monthlyTrend?.length ? (
                        <div className="admin-bar-chart" style={{ marginBottom: '2rem' }}>
                            {expenses.monthlyTrend.map((m, i) => (
                                <div key={i} className="admin-bar" style={{ height: `${(m.total / maxExpTrend) * 100}%`, minHeight: '8px',
                                    background: `linear-gradient(180deg, #F59E0B, #F59E0B99)` }}>
                                    <span className="admin-bar-value">${m.total}</span>
                                    <span className="admin-bar-label">{m.label?.split(' ')[0]}</span>
                                </div>
                            ))}
                        </div>
                    ) : <div className="admin-empty-state" style={{ padding: '2rem' }}><p>No monthly data</p></div>}
                </div>
            </div>

            {/* Top Spenders Leaderboard + Trip Duration + Category Detail */}
            <div className="admin-grid-2">
                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">🏆 Top Spenders</div><div className="admin-card-subtitle">Users with highest total spending</div></div>
                    </div>
                    <div className="admin-scrollable">
                        {(trends?.topSpenders || []).map((s, i) => (
                            <div key={i} className="admin-leaderboard-item">
                                <div className={`admin-leaderboard-rank ${i === 0 ? 'gold' : i === 1 ? 'silver' : i === 2 ? 'bronze' : 'default'}`}>
                                    {i + 1}
                                </div>
                                <img src={`https://ui-avatars.com/api/?name=${s.first_name}+${s.last_name}&background=${i === 0 ? 'FEF3C7' : 'EFF6FF'}&color=${i === 0 ? 'D97706' : '0077B6'}&bold=true`}
                                    style={{ width: 36, height: 36, borderRadius: 10 }} alt="" />
                                <div style={{ flex: 1 }}>
                                    <div style={{ fontWeight: 700, fontSize: '0.88rem' }}>{s.first_name} {s.last_name}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#9CA3AF' }}>{s.trip_count} trips</div>
                                </div>
                                <div style={{ fontWeight: 900, color: '#059669', fontSize: '1rem' }}>
                                    ${s.total_spent.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {!trends?.topSpenders?.length && <div className="admin-empty-state" style={{ padding: '2rem' }}><p>No spending data</p></div>}
                    </div>
                </div>

                <div className="admin-card">
                    <div className="admin-card-header">
                        <div><div className="admin-card-title">⏱️ Trip Duration Analytics</div><div className="admin-card-subtitle">How long are users traveling?</div></div>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                        {[
                            { label: 'Average', value: `${trends?.durationStats?.avgDuration || 0}d`, color: '#0077B6' },
                            { label: 'Shortest', value: `${trends?.durationStats?.minDuration || 0}d`, color: '#10B981' },
                            { label: 'Longest', value: `${trends?.durationStats?.maxDuration || 0}d`, color: '#EF4444' },
                        ].map((d, i) => (
                            <div key={i} style={{ flex: 1, textAlign: 'center', padding: '1.5rem', background: '#F9FAFB', borderRadius: 16 }}>
                                <div style={{ fontSize: '2rem', fontWeight: 900, color: d.color }}>{d.value}</div>
                                <div style={{ fontSize: '0.72rem', color: '#9CA3AF', fontWeight: 700, textTransform: 'uppercase' }}>{d.label}</div>
                            </div>
                        ))}
                    </div>

                    {/* Expense Category Detail Table */}
                    {expenses?.categoryBreakdown?.length > 0 && (
                        <div>
                            <div className="admin-card-title" style={{ marginBottom: '1rem' }}>Category Details</div>
                            {expenses.categoryBreakdown.map((c, i) => (
                                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid #F3F4F6' }}>
                                    <div className="admin-legend-dot" style={{ background: COLORS[i % 8], width: 10, height: 10 }} />
                                    <span style={{ flex: 1, fontWeight: 600, fontSize: '0.88rem' }}>{c.category}</span>
                                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>{c.entries} entries</span>
                                    <span style={{ fontSize: '0.78rem', color: '#6B7280' }}>avg ${c.average}</span>
                                    <span style={{ fontWeight: 800, color: '#111', fontSize: '0.9rem' }}>${c.total.toLocaleString()}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Top Trips by Expense */}
            {expenses?.topTrips?.length > 0 && (
                <div className="admin-card" style={{ marginTop: '1.5rem', padding: 0, overflow: 'hidden' }}>
                    <div style={{ padding: '1.5rem 1.5rem 0' }}>
                        <div className="admin-card-title">🎯 Most Expensive Trips</div>
                        <div className="admin-card-subtitle">Trips with highest total spending</div>
                    </div>
                    <table className="admin-table" style={{ marginTop: '1rem' }}>
                        <thead><tr><th>Trip Name</th><th>User</th><th>Expenses</th><th>Total Spent</th></tr></thead>
                        <tbody>
                            {expenses.topTrips.map((t, i) => (
                                <tr key={i}>
                                    <td>{t.trip_name}</td>
                                    <td style={{ color: '#6B7280' }}>{t.first_name} {t.last_name}</td>
                                    <td>{t.expense_count} entries</td>
                                    <td style={{ fontWeight: 800, color: '#059669' }}>${t.total_expense.toLocaleString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default TrendsTab;
