import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, MapPin, Calendar, Clock, DollarSign, ChevronRight, Activity, Trash2, Camera } from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [showStopForm, setShowStopForm] = useState(false);
    const [activeStop, setActiveStop] = useState(null); // For adding activities
    const [newStop, setNewStop] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '' });
    const [newActivity, setNewActivity] = useState({ name: '', type: 'Sightseeing', cost: '', time: '10:00' });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const tripRes = await axios.get(`/api/trips`, { headers });
        setTrip(tripRes.data.find(t => t.id === parseInt(tripId)));
        const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
        
        // Fetch activities for each stop
        const stopsWithActivities = await Promise.all(stopsRes.data.map(async stop => {
            const actRes = await axios.get(`/api/itinerary/activities/${stop.id}`, { headers });
            return { ...stop, activities: actRes.data };
        }));
        setStops(stopsWithActivities);
    };

    useEffect(() => { fetchData(); }, [tripId]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/api/itinerary/stops', { ...newStop, tripId, orderIndex: stops.length }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setShowStopForm(false);
        fetchData();
    };

    const handleAddActivity = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        await axios.post('/api/itinerary/activities', { ...newActivity, stopId: activeStop }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setActiveStop(null);
        fetchData();
    };

    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}>Loading itinerary...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', marginBottom: '0.8rem' }}>{trip.name}</h1>
                        <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)' }}>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><Calendar size={16} /> {new Date(trip.start_date).toLocaleDateString()} — {new Date(trip.end_date).toLocaleDateString()}</span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><MapPin size={16} /> {stops.length} Cities planned</span>
                        </div>
                    </div>
                    <Link to={`/utilities/${tripId}`} className="btn-primary" style={{ textDecoration: 'none', background: 'var(--secondary)' }}>Manage Budget & Packing</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                    {/* Timeline */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                            <h3 style={{ fontSize: '1.4rem' }}>Itinerary Timeline</h3>
                            <button onClick={() => setShowStopForm(true)} className="btn-primary" style={{ padding: '8px 20px', borderRadius: '10px' }}>+ Add Stop</button>
                        </div>

                        {showStopForm && (
                            <div className="premium-card" style={{ marginBottom: '2rem', background: '#f8f9fa' }}>
                                <h4 style={{ marginBottom: '1.5rem' }}>Add a New Destination</h4>
                                <form onSubmit={handleAddStop} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <input type="text" placeholder="City (e.g. Paris)" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, cityName: e.target.value})} required />
                                    <input type="text" placeholder="Country" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, country: e.target.value})} required />
                                    <input type="date" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                    <input type="date" style={{ padding: '12px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, departureDate: e.target.value})} required />
                                    <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Add to Itinerary</button>
                                </form>
                            </div>
                        )}

                        <div style={{ position: 'relative', paddingLeft: '3rem', borderLeft: '3px solid #eee', marginLeft: '10px' }}>
                            {stops.map((stop, i) => (
                                <div key={stop.id} style={{ marginBottom: '3rem', position: 'relative' }}>
                                    {/* Stop Circle */}
                                    <div style={{ position: 'absolute', left: '-58px', top: '5px', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--primary)', border: '6px solid white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}></div>
                                    
                                    <div className="premium-card" style={{ padding: '2rem' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                            <div>
                                                <p style={{ fontWeight: 700, color: 'var(--secondary)', fontSize: '0.8rem', textTransform: 'uppercase' }}>Day {i + 1} — {stop.city_name}</p>
                                                <h3 style={{ fontSize: '1.6rem' }}>{stop.city_name}, {stop.country}</h3>
                                            </div>
                                            <button onClick={() => setActiveStop(stop.id)} className="btn-primary" style={{ background: '#eee', color: 'var(--primary)', padding: '6px 15px', borderRadius: '8px', fontSize: '0.9rem' }}>+ Activity</button>
                                        </div>

                                        {/* Activity List */}
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                            {stop.activities?.map((act, j) => (
                                                <div key={j} style={{ display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', background: '#fcfcfc', borderRadius: '12px', border: '1px solid #f0f2f5' }}>
                                                    <div style={{ background: 'var(--primary)', color: 'white', padding: '10px', borderRadius: '10px' }}><Activity size={18} /></div>
                                                    <div style={{ flex: 1 }}>
                                                        <p style={{ fontWeight: 700 }}>{act.name}</p>
                                                        <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Clock size={12} /> {act.time} • {act.type}</p>
                                                    </div>
                                                    <p style={{ fontWeight: 700, color: 'var(--primary)' }}>${act.cost}</p>
                                                </div>
                                            ))}
                                            
                                            {activeStop === stop.id && (
                                                <form onSubmit={handleAddActivity} className="animate-fade-in" style={{ padding: '1.5rem', background: '#f8f9fa', borderRadius: '12px', marginTop: '1rem' }}>
                                                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                                                        <input type="text" placeholder="Activity Name" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewActivity({...newActivity, name: e.target.value})} required />
                                                        <input type="number" placeholder="Cost ($)" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewActivity({...newActivity, cost: e.target.value})} required />
                                                        <input type="time" style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewActivity({...newActivity, time: e.target.value})} required />
                                                        <select style={{ padding: '10px', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewActivity({...newActivity, type: e.target.value})}>
                                                            <option>Sightseeing</option>
                                                            <option>Dining</option>
                                                            <option>Adventure</option>
                                                            <option>Transport</option>
                                                        </select>
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '10px' }}>
                                                        <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Activity</button>
                                                        <button type="button" onClick={() => setActiveStop(null)} style={{ background: '#ddd', padding: '10px 20px', borderRadius: '8px' }}>Cancel</button>
                                                    </div>
                                                </form>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Stats Sidebar */}
                    <aside>
                        <div className="premium-card" style={{ background: 'var(--primary)', color: 'white', position: 'sticky', top: '2rem' }}>
                            <h3 style={{ color: 'white', marginBottom: '2rem' }}>Trip Overview</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <span>Total Stops</span>
                                    <strong>{stops.length} Cities</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '1rem' }}>
                                    <span>Est. Activities</span>
                                    <strong>{stops.reduce((acc, s) => acc + (s.activities?.length || 0), 0)} Items</strong>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '1rem' }}>
                                    <span>Itinerary Score</span>
                                    <strong style={{ color: 'var(--accent)' }}>9.4/10</strong>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ width: '100%', background: 'var(--secondary)', border: 'none', color: 'white', marginTop: '2rem', padding: '1.2rem' }}>Finalize Trip Plan</button>
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default ItineraryBuilder;
