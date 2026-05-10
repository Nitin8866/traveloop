import React from 'react';
import Layout from '../components/layout/Layout';
import { Users, Map, Activity, TrendingUp, PieChart, BarChart3, LineChart, Search } from 'lucide-react';

const AdminPanel = () => {
    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Admin Panel</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Monitor platform activity and user trends.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative', width: '250px' }}>
                            <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                            <input type="text" placeholder="Search..." style={{ width: '100%', padding: '8px 12px 8px 36px', fontSize: '0.9rem' }} />
                        </div>
                    </div>
                </div>

                {/* Quick Stats */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2rem', marginBottom: '3rem' }}>
                    {[
                        { label: 'Manage Users', count: '12,450', icon: <Users />, color: '#6366F1' },
                        { label: 'Popular Cities', count: '840', icon: <Map />, color: '#10B981' },
                        { label: 'Popular Activities', count: '3,200', icon: <Activity />, color: '#F59E0B' },
                        { label: 'Trends & Analytics', count: '+12.5%', icon: <TrendingUp />, color: '#00B8D4' },
                    ].map((stat, i) => (
                        <div key={i} className="premium-card" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                            <div style={{ background: `${stat.color}15`, color: stat.color, padding: '12px', borderRadius: '14px' }}>
                                {stat.icon}
                            </div>
                            <div>
                                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>{stat.label}</p>
                                <p style={{ fontSize: '1.4rem', fontWeight: 800 }}>{stat.count}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Charts Area (Matches Wireframe) */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2.5rem' }}>
                    <div className="premium-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '3rem' }}>
                        <h3 style={{ marginBottom: '2rem', alignSelf: 'flex-start' }}>Destination Distribution</h3>
                        <div style={{ width: '200px', height: '200px', borderRadius: '50%', border: '25px solid #F3F4F6', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <div style={{ width: '100%', height: '100%', borderRadius: '50%', border: '25px solid var(--primary)', position: 'absolute', borderTopColor: 'transparent', transform: 'rotate(45deg)' }}></div>
                            <PieChart size={48} color="#ddd" />
                        </div>
                        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: 'var(--primary)' }}></div> Europe</div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem' }}><div style={{ width: '12px', height: '12px', borderRadius: '4px', background: '#eee' }}></div> Asia</div>
                        </div>
                    </div>

                    <div className="premium-card" style={{ padding: '3rem' }}>
                        <h3 style={{ marginBottom: '2rem' }}>User Growth Trend</h3>
                        <div style={{ height: '250px', display: 'flex', alignItems: 'flex-end', gap: '10px' }}>
                            {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                                <div key={i} style={{ flex: 1, height: `${h}%`, background: i === 7 ? 'var(--primary-gradient)' : '#F3F4F6', borderRadius: '8px 8px 0 0', transition: '0.5s' }}></div>
                            ))}
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default AdminPanel;
