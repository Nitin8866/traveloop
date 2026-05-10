import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Search, SlidersHorizontal, ChevronDown, ChevronUp, Trash2, Eye, X, MapPin, Calendar, DollarSign, Activity } from 'lucide-react';
import '../../styles/AdminPanel.css';

const ManageUsersTab = () => {
    const [users, setUsers] = useState([]);
    const [pagination, setPagination] = useState({ total: 0, page: 1, totalPages: 1 });
    const [search, setSearch] = useState('');
    const [sort, setSort] = useState('newest');
    const [groupBy, setGroupBy] = useState('');
    const [groups, setGroups] = useState(null);
    const [expandedUser, setExpandedUser] = useState(null);
    const [userDetail, setUserDetail] = useState(null);
    const [deleteConfirm, setDeleteConfirm] = useState(null);
    const [loading, setLoading] = useState(true);
    const [detailLoading, setDetailLoading] = useState(false);

    const token = localStorage.getItem('adminToken');
    const headers = { Authorization: `Bearer ${token}` };

    const fetchUsers = useCallback(async (page = 1) => {
        setLoading(true);
        try {
            const res = await axios.get('/api/admin/users', {
                headers, params: { search, sort, page, limit: 15, groupBy }
            });
            setUsers(res.data.users);
            setPagination(res.data.pagination);
            setGroups(res.data.groups);
        } catch (err) { console.error(err); }
        setLoading(false);
    }, [search, sort, groupBy]);

    useEffect(() => { fetchUsers(); }, [fetchUsers]);

    const handleExpand = async (userId) => {
        if (expandedUser === userId) { setExpandedUser(null); setUserDetail(null); return; }
        setExpandedUser(userId);
        setDetailLoading(true);
        try {
            const res = await axios.get(`/api/admin/users/${userId}`, { headers });
            setUserDetail(res.data);
        } catch (err) { console.error(err); }
        setDetailLoading(false);
    };

    const handleDelete = async (userId) => {
        try {
            await axios.delete(`/api/admin/users/${userId}`, { headers });
            setDeleteConfirm(null);
            fetchUsers(pagination.page);
        } catch (err) { alert('Error deleting user'); }
    };

    const sortOptions = [
        { value: 'newest', label: 'Newest First' }, { value: 'oldest', label: 'Oldest First' },
        { value: 'name_asc', label: 'Name A-Z' }, { value: 'name_desc', label: 'Name Z-A' },
        { value: 'most_trips', label: 'Most Trips' }, { value: 'most_spent', label: 'Highest Spend' }
    ];

    return (
        <div className="animate-fade-in">
            {/* Toolbar */}
            <div className="admin-toolbar">
                <div className="admin-search">
                    <Search size={18} />
                    <input type="text" placeholder="Search users by name, email, city..." value={search} onChange={e => setSearch(e.target.value)} />
                </div>
                <select value={sort} onChange={e => setSort(e.target.value)} className="admin-filter-btn" style={{ appearance: 'auto', paddingRight: '10px' }}>
                    {sortOptions.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                <select value={groupBy} onChange={e => setGroupBy(e.target.value)} className="admin-filter-btn" style={{ appearance: 'auto', paddingRight: '10px' }}>
                    <option value="">No Grouping</option>
                    <option value="country">Group by Country</option>
                    <option value="city">Group by City</option>
                </select>
            </div>

            {/* Group Summary */}
            {groups && groups.length > 0 && (
                <div className="admin-card" style={{ marginBottom: '1.5rem', padding: '1.2rem 1.5rem' }}>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {groups.slice(0, 10).map((g, i) => (
                            <span key={i} className="admin-badge blue" style={{ fontSize: '0.8rem', padding: '6px 14px' }}>
                                {g.country || g.city}: {g.count}
                            </span>
                        ))}
                    </div>
                </div>
            )}

            {/* Users Table */}
            <div className="admin-card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <div style={{ padding: '2rem' }}>{[1,2,3,4,5].map(i => <div key={i} className="admin-skeleton" style={{ height: 50, marginBottom: 8 }} />)}</div>
                ) : (
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>User</th><th>Email</th><th>Location</th><th>Trips</th><th>Activities</th><th>Total Spent</th><th>Joined</th><th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <React.Fragment key={u.id}>
                                    <tr>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <img src={`https://ui-avatars.com/api/?name=${u.first_name}+${u.last_name}&background=EFF6FF&color=0077B6&bold=true&size=36`} style={{ width: 36, height: 36, borderRadius: 10 }} alt="" />
                                                <span>{u.first_name} {u.last_name}</span>
                                            </div>
                                        </td>
                                        <td style={{ color: '#6B7280', fontSize: '0.85rem' }}>{u.email}</td>
                                        <td><span className="admin-badge blue">{u.city || '—'}, {u.country || '—'}</span></td>
                                        <td><strong>{u.trip_count}</strong></td>
                                        <td>{u.activity_count}</td>
                                        <td style={{ fontWeight: 700, color: '#059669' }}>₹{parseFloat(u.total_spent).toLocaleString()}</td>
                                        <td style={{ fontSize: '0.8rem', color: '#9CA3AF' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                                        <td style={{ textAlign: 'right' }}>
                                            <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                                                <button className="admin-action-btn" onClick={() => handleExpand(u.id)} title="View Details">
                                                    {expandedUser === u.id ? <ChevronUp size={16} /> : <Eye size={16} />}
                                                </button>
                                                <button className="admin-action-btn danger" onClick={() => setDeleteConfirm(u)} title="Delete User">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                    {expandedUser === u.id && (
                                        <tr><td colSpan={8} style={{ padding: '0 16px 16px' }}>
                                            {detailLoading ? <div className="admin-skeleton" style={{ height: 200 }} /> : userDetail && (
                                                <UserDetailPanel detail={userDetail} />
                                            )}
                                        </td></tr>
                                    )}
                                </React.Fragment>
                            ))}
                            {!users.length && <tr><td colSpan={8} className="admin-empty-state">No users found</td></tr>}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Pagination */}
            {pagination.totalPages > 1 && (
                <div className="admin-pagination">
                    <button className="admin-page-btn" disabled={pagination.page <= 1} onClick={() => fetchUsers(pagination.page - 1)}>← Prev</button>
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => i + 1).map(p => (
                        <button key={p} className={`admin-page-btn ${pagination.page === p ? 'active' : ''}`} onClick={() => fetchUsers(p)}>{p}</button>
                    ))}
                    <button className="admin-page-btn" disabled={pagination.page >= pagination.totalPages} onClick={() => fetchUsers(pagination.page + 1)}>Next →</button>
                </div>
            )}

            {/* Delete Confirm */}
            {deleteConfirm && (
                <div className="admin-confirm-overlay" onClick={() => setDeleteConfirm(null)}>
                    <div className="admin-confirm-dialog" onClick={e => e.stopPropagation()}>
                        <div style={{ background: '#FEF2F2', width: 64, height: 64, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
                            <Trash2 size={28} color="#EF4444" />
                        </div>
                        <h3 style={{ marginBottom: '0.5rem' }}>Delete User?</h3>
                        <p style={{ color: '#6B7280', marginBottom: '2rem', fontSize: '0.9rem' }}>
                            This will permanently delete <strong>{deleteConfirm.first_name} {deleteConfirm.last_name}</strong> and all their trips, expenses, and data.
                        </p>
                        <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                            <button className="admin-filter-btn" onClick={() => setDeleteConfirm(null)}>Cancel</button>
                            <button className="admin-action-btn danger" style={{ background: '#EF4444', color: 'white', borderColor: '#EF4444', padding: '10px 24px' }} onClick={() => handleDelete(deleteConfirm.id)}>
                                Delete Permanently
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const UserDetailPanel = ({ detail }) => {
    const { user, trips, summary } = detail;
    return (
        <div className="admin-user-detail">
            <div style={{ display: 'flex', gap: '2rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                {[
                    { icon: <MapPin size={16} />, label: 'Trips', value: summary.totalTrips, color: '#0077B6' },
                    { icon: <Activity size={16} />, label: 'Activities', value: summary.totalActivities, color: '#8B5CF6' },
                    { icon: <DollarSign size={16} />, label: 'Total Spent', value: `₹${summary.totalExpense.toLocaleString()}`, color: '#10B981' },
                    { icon: <MapPin size={16} />, label: 'Cities Visited', value: summary.totalStops, color: '#F59E0B' },
                ].map((s, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 16px', background: 'white', borderRadius: 12, border: '1px solid #F3F4F6' }}>
                        <div style={{ color: s.color }}>{s.icon}</div>
                        <div><div style={{ fontSize: '0.7rem', color: '#9CA3AF', fontWeight: 700 }}>{s.label}</div><div style={{ fontWeight: 800, fontSize: '1rem' }}>{s.value}</div></div>
                    </div>
                ))}
            </div>
            {trips.map((trip, i) => (
                <div key={i} style={{ background: 'white', borderRadius: 14, padding: '1.2rem', marginBottom: '0.8rem', border: '1px solid #F3F4F6' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
                        <div><strong style={{ fontSize: '0.95rem' }}>{trip.name}</strong>
                            <div style={{ fontSize: '0.75rem', color: '#9CA3AF', marginTop: 2 }}>
                                {trip.start_date && new Date(trip.start_date).toLocaleDateString()} — {trip.end_date && new Date(trip.end_date).toLocaleDateString()}
                            </div>
                        </div>
                        <div style={{ display: 'flex', gap: 8 }}>
                            <span className="admin-badge green">{trip.stopCount} stops</span>
                            <span className="admin-badge purple">{trip.activityCount} activities</span>
                            <span className="admin-badge orange">₹{trip.totalExpense.toLocaleString()}</span>
                        </div>
                    </div>
                    {trip.stops.length > 0 && (
                        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                            {trip.stops.map((stop, j) => (
                                <span key={j} style={{ padding: '4px 10px', background: '#F0F7FF', borderRadius: 8, fontSize: '0.75rem', color: '#0077B6', fontWeight: 600 }}>
                                    📍 {stop.city_name}{stop.country ? `, ${stop.country}` : ''}
                                    {stop.activities.length > 0 && ` (${stop.activities.length} activities)`}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            ))}
            {!trips.length && <p style={{ color: '#9CA3AF', textAlign: 'center', padding: '1rem' }}>No trips created yet</p>}
        </div>
    );
};

export default ManageUsersTab;
