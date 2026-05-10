import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Plus, Calendar, MapPin, DollarSign, ArrowRight, Sparkles, Trash2, CheckCircle2, Navigation } from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showStopForm, setShowStopForm] = useState(false);
    const [newStop, setNewStop] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '', budget: '0' });

    // Mock Budget API Logic
    const calculateBudget = (city) => {
        const luxuryCities = ['Paris', 'London', 'New York', 'Tokyo', 'Dubai'];
        return luxuryCities.some(c => city.includes(c)) ? 1500 : 800;
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const tripRes = await axios.get(`/api/trips`, { headers });
        const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
        setTrip(currentTrip);

        const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
        setStops(stopsRes.data);

        // Generate Real Suggestions between Source and Destination
        if (currentTrip) {
            const mockSuggestions = [
                { name: 'Amsterdam, Netherlands', img: 'https://images.unsplash.com/photo-1512470876302-972faa2aa9a4' },
                { name: 'Berlin, Germany', img: 'https://images.unsplash.com/photo-1560969184-10fe8719e047' },
                { name: 'Prague, Czech Republic', img: 'https://images.unsplash.com/photo-1541849546-216549ae216d' },
            ];
            setSuggestions(mockSuggestions);
        }
    };

    useEffect(() => { fetchData(); }, [tripId]);

    const handleAddStop = async (stopData) => {
        const token = localStorage.getItem('token');
        const estimatedBudget = calculateBudget(stopData.cityName);
        await axios.post('/api/itinerary/stops', { 
            ...stopData, 
            tripId, 
            orderIndex: stops.length,
            budget: estimatedBudget
        }, {
            headers: { Authorization: `Bearer ${token}` }
        });
        setShowStopForm(false);
        fetchData();
    };

    if (!trip) return <Layout><div>Generating intelligent route...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1100px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '3.5rem' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: 'var(--primary)', marginBottom: '0.5rem' }}>
                            <Navigation size={18} />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem', textTransform: 'uppercase' }}>{trip.source_place} <ArrowRight size={14} /> {trip.destination_place}</span>
                        </div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Build Itinerary</h1>
                    </div>
                    <Link to={`/itinerary-view/${tripId}`} className="btn-primary">View Final Timeline</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '3rem' }}>
                    {/* Active Itinerary Sections */}
                    <section>
                        <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '2rem' }}>Journey Sections</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {stops.map((stop, i) => (
                                <div key={stop.id} className="premium-card animate-fade-in" style={{ borderLeft: '6px solid var(--primary)', padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                        <h4 style={{ fontWeight: 800 }}>{i + 1}. {stop.city_name}</h4>
                                        <span style={{ background: '#F0FDF4', color: '#166534', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800 }}>Confirmed Stop</span>
                                    </div>
                                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                                        <div style={{ flex: 1, padding: '12px', background: '#F9FAFB', borderRadius: '12px', fontSize: '0.8rem' }}>
                                            <Calendar size={14} style={{ marginBottom: '4px' }} />
                                            <p style={{ fontWeight: 700 }}>{new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}</p>
                                        </div>
                                        <div style={{ flex: 1, padding: '12px', background: '#F9FAFB', borderRadius: '12px', fontSize: '0.8rem' }}>
                                            <DollarSign size={14} style={{ marginBottom: '4px' }} />
                                            <p style={{ fontWeight: 700, color: 'var(--primary)' }}>Budget: ${calculateBudget(stop.city_name)}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {showStopForm ? (
                                <div className="premium-card animate-fade-in" style={{ background: '#F9FAFB' }}>
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddStop(newStop); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <input type="text" placeholder="City Name" onChange={e => setNewStop({...newStop, cityName: e.target.value})} required />
                                        <input type="text" placeholder="Country" onChange={e => setNewStop({...newStop, country: e.target.value})} required />
                                        <input type="date" onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                        <input type="date" onChange={e => setNewStop({...newStop, departureDate: e.target.value})} required />
                                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2' }}>Add Section</button>
                                    </form>
                                </div>
                            ) : (
                                <button onClick={() => setShowStopForm(true)} style={{ border: '2px dashed #ddd', background: 'none', padding: '2rem', borderRadius: '20px', cursor: 'pointer', color: 'var(--text-muted)', fontWeight: 700 }}>
                                    + Add another Section
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Intelligent Suggestions Sidebar */}
                    <aside>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
                            <Sparkles size={24} color="var(--primary)" />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Suggested Stops</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {suggestions.map((place, i) => (
                                <div key={i} className="premium-card" style={{ padding: '1rem', position: 'relative' }}>
                                    <div style={{ height: '140px', borderRadius: '12px', overflow: 'hidden', marginBottom: '1rem' }}>
                                        <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="" />
                                    </div>
                                    <h5 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>{place.name}</h5>
                                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1rem' }}>Recommended stop on your route from {trip.source_place} to {trip.destination_place}.</p>
                                    <button 
                                        className="btn-primary" 
                                        style={{ width: '100%', padding: '10px', fontSize: '0.85rem' }}
                                        onClick={() => handleAddStop({ cityName: place.name.split(',')[0], country: place.name.split(',')[1].trim(), arrivalDate: trip.start_date, departureDate: trip.end_date })}
                                    >
                                        Add to Route
                                    </button>
                                </div>
                            ))}
                        </div>
                    </aside>
                </div>
            </div>
        </Layout>
    );
};

export default ItineraryBuilder;
