import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Search, SlidersHorizontal, LayoutGrid, ArrowDown, DollarSign, MapPin, Calendar, Clock } from 'lucide-react';

const ItineraryView = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const headers = { Authorization: `Bearer ${token}` };
            const tripRes = await axios.get(`/api/trips`, { headers });
            setTrip(tripRes.data.find(t => t.id === parseInt(tripId)));
            const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
            
            const stopsWithActivities = await Promise.all(stopsRes.data.map(async stop => {
                const actRes = await axios.get(`/api/itinerary/activities/${stop.id}`, { headers });
                return { ...stop, activities: actRes.data };
            }));
            setStops(stopsWithActivities);
        };
        fetchData();
    }, [tripId]);

    if (!trip) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Itinerary for {trip.name}</h1>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
                        <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {stops.length} Destinations</span>
                    </div>
                </div>

                {/* Filters Row (Matches Wireframe) */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search itinerary..." style={{ width: '100%', paddingLeft: '48px' }} />
                    </div>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </div>

                {/* Itinerary Grid (Matches Wireframe: Day | Physical Activity | Expense) */}
                <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '2rem', padding: '1rem', borderBottom: '2px solid #eee', marginBottom: '2rem', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', fontSize: '0.8rem', letterSpacing: '1px' }}>
                    <div>Day</div>
                    <div>Physical Activity</div>
                    <div style={{ textAlign: 'right' }}>Expense</div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4rem' }}>
                    {stops.map((stop, i) => (
                        <div key={stop.id} style={{ display: 'grid', gridTemplateColumns: '100px 1fr 150px', gap: '2rem' }}>
                            {/* Day Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                <div style={{ width: '60px', height: '60px', borderRadius: '20px', background: 'var(--primary-gradient)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '1.2rem', boxShadow: 'var(--shadow)' }}>
                                    {i + 1}
                                </div>
                            </div>

                            {/* Physical Activity Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stop.activities?.map((act, j) => (
                                    <React.Fragment key={j}>
                                        <div className="premium-card" style={{ padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                            <div style={{ background: '#F0FDF4', color: '#166534', padding: '10px', borderRadius: '12px' }}><Clock size={20} /></div>
                                            <div style={{ flex: 1 }}>
                                                <h4 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{act.name}</h4>
                                                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{act.time} • {act.type}</p>
                                            </div>
                                        </div>
                                        {j < stop.activities.length - 1 && <div style={{ display: 'flex', justifyContent: 'center', color: '#eee' }}><ArrowDown size={24} /></div>}
                                    </React.Fragment>
                                ))}
                                {stop.activities?.length === 0 && <p style={{ color: '#999', textAlign: 'center', padding: '2rem', border: '2px dashed #eee', borderRadius: '20px' }}>No activities planned for this city.</p>}
                            </div>

                            {/* Expense Column */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {stop.activities?.map((act, j) => (
                                    <div key={j} style={{ height: '88px', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', fontWeight: 800, color: 'var(--primary)', fontSize: '1.2rem' }}>
                                        ${act.cost}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div style={{ marginTop: '5rem', padding: '3rem', background: 'white', borderRadius: '32px', border: '1px solid #eee', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>Total Trip Budget</h3>
                        <p style={{ color: 'var(--text-muted)' }}>Estimated total based on your activities and stops.</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Grand Total</p>
                        <h2 style={{ fontSize: '3rem', color: 'var(--primary)', fontWeight: 900 }}>$2,450.00</h2>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ItineraryView;
