import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, MapPin, Calendar, Clock, DollarSign, ChevronDown, ChevronUp, Trash2 } from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [showStopForm, setShowStopForm] = useState(false);
    const [newStop, setNewStop] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '' });

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        // Fetch Trip Details
        const tripRes = await axios.get(`/api/trips`, { headers });
        const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
        setTrip(currentTrip);

        // Fetch Stops
        const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
        setStops(stopsRes.data);
    };

    useEffect(() => {
        fetchData();
    }, [tripId]);

    const handleAddStop = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.post('/api/itinerary/stops', { ...newStop, tripId, orderIndex: stops.length }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setShowStopForm(false);
            fetchData();
        } catch (error) {
            alert('Error adding stop');
        }
    };

    if (!trip) return <div style={{ padding: '5rem', textAlign: 'center' }}>Loading itinerary...</div>;

    return (
        <div style={{ padding: '4rem 10%', minHeight: '100vh', background: '#fcfcfc' }}>
            <div style={{ marginBottom: '3rem', borderBottom: '1px solid #eee', paddingBottom: '2rem' }}>
                <Link to="/my-trips" style={{ color: 'var(--text-muted)', textDecoration: 'none', marginBottom: '1rem', display: 'block' }}>← Back to My Journeys</Link>
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{trip.name}</h1>
                <p style={{ color: 'var(--text-muted)' }}>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '3rem' }}>
                {/* Timeline / Stops List */}
                <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.8rem' }}>Trip Timeline</h2>
                        <button onClick={() => setShowStopForm(true)} className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Plus size={18} /> Add City
                        </button>
                    </div>

                    {showStopForm && (
                        <div className="premium-card animate-fade-in" style={{ marginBottom: '2rem', border: '2px solid var(--primary)' }}>
                            <h3 style={{ marginBottom: '1.5rem' }}>Add a New Destination</h3>
                            <form onSubmit={handleAddStop} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                <input type="text" placeholder="City Name" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, cityName: e.target.value})} required />
                                <input type="text" placeholder="Country" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, country: e.target.value})} required />
                                <input type="date" placeholder="Arrival" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                <input type="date" placeholder="Departure" style={{ padding: '0.8rem', borderRadius: '8px', border: '1px solid #ddd' }} onChange={e => setNewStop({...newStop, departureDate: e.target.value})} required />
                                <div style={{ gridColumn: 'span 2', display: 'flex', gap: '1rem' }}>
                                    <button type="submit" className="btn-primary" style={{ flex: 1 }}>Save Destination</button>
                                    <button type="button" onClick={() => setShowStopForm(false)} style={{ flex: 0.5, background: '#eee', borderRadius: '8px' }}>Cancel</button>
                                </div>
                            </form>
                        </div>
                    )}

                    <div style={{ position: 'relative', paddingLeft: '2rem', borderLeft: '2px dashed #ddd', marginLeft: '10px' }}>
                        {stops.map((stop, index) => (
                            <div key={stop.id} className="premium-card" style={{ marginBottom: '2rem', position: 'relative' }}>
                                <div style={{ position: 'absolute', left: '-42px', top: '20px', width: '20px', height: '20px', borderRadius: '50%', background: 'var(--primary)', border: '4px solid white', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}></div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                    <div>
                                        <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--secondary)', textTransform: 'uppercase', letterSpacing: '1px' }}>Stop {index + 1}</span>
                                        <h3 style={{ fontSize: '1.5rem', marginTop: '4px' }}>{stop.city_name}, {stop.country}</h3>
                                    </div>
                                    <div style={{ textAlign: 'right', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {new Date(stop.arrival_date).toLocaleDateString()}</div>
                                        <div>to {new Date(stop.departure_date).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                
                                <div style={{ padding: '1rem', background: '#f8f9fa', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px dashed #ccc', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                                    <Plus size={16} style={{ marginRight: '8px' }} /> Add an activity, tour, or restaurant
                                </div>
                            </div>
                        ))}

                        {stops.length === 0 && !showStopForm && (
                            <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                                <p>Your timeline is empty. Add your first city to get started!</p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Summary Sidebar */}
                <aside>
                    <div className="premium-card" style={{ background: 'var(--primary)', color: 'white', position: 'sticky', top: '100px' }}>
                        <h3 style={{ color: 'white', marginBottom: '1.5rem' }}>Itinerary Summary</h3>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                                <span>Total Cities</span>
                                <strong>{stops.length}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '0.8rem' }}>
                                <span>Est. Budget</span>
                                <strong>$0.00</strong>
                            </div>
                        </div>
                        <button className="btn-primary" style={{ background: 'var(--secondary)', border: 'none', width: '100%', marginTop: '2rem', color: 'white' }}>Finalize & Share</button>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default ItineraryBuilder;
