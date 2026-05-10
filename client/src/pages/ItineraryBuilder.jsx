import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, Calendar, MapPin, DollarSign, Hotel, Plane, Coffee, MoreVertical, Trash2, CheckCircle2 } from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [showStopForm, setShowStopForm] = useState(false);
    const [newStop, setNewStop] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '', budget: '0' });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const tripRes = await axios.get(`/api/trips`, { headers });
        setTrip(tripRes.data.find(t => t.id === parseInt(tripId)));
        const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
        setStops(stopsRes.data);
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

    if (!trip) return <Layout><div>Loading...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Build Itinerary</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Customize each section of your trip to perfection.</p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <Link to={`/utilities/${tripId}`} className="btn-primary" style={{ background: '#F3F4F6', color: 'var(--text-main)', border: '1px solid #E5E7EB' }}>Financials & Packing</Link>
                        <button className="btn-primary">Finalize Plan</button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                    {stops.map((stop, i) => (
                        <div key={stop.id} className="premium-card animate-fade-in" style={{ borderLeft: '6px solid var(--primary)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <div style={{ background: 'var(--primary-gradient)', color: 'white', padding: '10px', borderRadius: '12px' }}>
                                        <MapPin size={20} />
                                    </div>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Section {i + 1}: {stop.city_name}, {stop.country}</h3>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <button style={{ padding: '8px', borderRadius: '8px', border: '1px solid #eee' }}><MoreVertical size={18} /></button>
                                </div>
                            </div>

                            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', lineHeight: 1.6 }}>
                                All the necessary information about this section. This can be anything like travel section, hotel or any other activity.
                            </p>

                            <div style={{ display: 'flex', gap: '2rem' }}>
                                <div style={{ flex: 1, padding: '1.2rem', background: '#F9FAFB', borderRadius: '14px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <Calendar size={18} color="var(--primary)" />
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Date Range</p>
                                        <p style={{ fontWeight: 700 }}>{new Date(stop.arrival_date).toLocaleDateString()} to {new Date(stop.departure_date).toLocaleDateString()}</p>
                                    </div>
                                </div>
                                <div style={{ flex: 1, padding: '1.2rem', background: '#F9FAFB', borderRadius: '14px', border: '1px solid #F3F4F6', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <DollarSign size={18} color="var(--accent)" />
                                    <div>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase' }}>Budget of this section</p>
                                        <p style={{ fontWeight: 700 }}>$1,200.00</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {showStopForm ? (
                        <div className="premium-card animate-fade-in" style={{ background: '#F9FAFB', border: '2px dashed var(--border)' }}>
                            <form onSubmit={handleAddStop} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <input type="text" placeholder="City Name" onChange={e => setNewStop({...newStop, cityName: e.target.value})} required />
                                <input type="text" placeholder="Country" onChange={e => setNewStop({...newStop, country: e.target.value})} required />
                                <input type="date" onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                <input type="date" onChange={e => setNewStop({...newStop, departureDate: e.target.value})} required />
                                <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Add Section</button>
                            </form>
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowStopForm(true)}
                            className="premium-card" 
                            style={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                justifyContent: 'center', 
                                gap: '12px', 
                                border: '2px dashed var(--border)', 
                                padding: '2rem',
                                color: 'var(--text-muted)',
                                fontWeight: 700,
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                transition: '0.3s'
                            }}
                        >
                            <Plus size={24} /> Add another Section
                        </button>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default ItineraryBuilder;
