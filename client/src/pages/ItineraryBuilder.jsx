import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Plus, Calendar, MapPin, DollarSign, ArrowRight, Sparkles, 
    Trash2, CheckCircle2, Navigation, Compass, Info, Clock 
} from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showStopForm, setShowStopForm] = useState(false);
    const [newStop, setNewStop] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '', budget: '0' });

    // Intelligent Suggestion Engine based on Geographic Keywords
    const getIntelligentSuggestions = (source, dest) => {
        const route = `${source} ${dest}`.toLowerCase();
        
        // Logic for India (Gujarat/Maharashtra Route)
        if (route.includes('india') && (route.includes('gujarat') || route.includes('daman') || route.includes('dwarka'))) {
            return [
                { 
                    name: 'Surat, Gujarat', 
                    img: 'https://images.unsplash.com/photo-1595815771614-ade9d652a65d',
                    desc: 'A perfect mid-way stop known for its diamond industry and delicious street food.',
                    estBudget: 450
                },
                { 
                    name: 'Ahmedabad, Gujarat', 
                    img: 'https://images.unsplash.com/photo-1599932064112-9c169623e1d1',
                    desc: 'The UNESCO Heritage city with stunning architecture and Sabarmati Ashram.',
                    estBudget: 600
                },
                { 
                    name: 'Rajkot, Gujarat', 
                    img: 'https://images.unsplash.com/photo-1626240228784-18451f22e205',
                    desc: 'A bustling commercial hub with rich history, ideal for a rest stop before Dwarka.',
                    estBudget: 500
                }
            ];
        }

        // Default Global Suggestions
        return [
            { name: 'Paris, France', img: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34', desc: 'The City of Lights, perfect for any European route.', estBudget: 1200 },
            { name: 'Dubai, UAE', img: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', desc: 'A futuristic oasis for luxury and shopping.', estBudget: 1500 }
        ];
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const tripRes = await axios.get(`/api/trips`, { headers });
            const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
            setTrip(currentTrip);

            if (currentTrip) {
                setSuggestions(getIntelligentSuggestions(currentTrip.source_place, currentTrip.destination_place));
            }

            const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
            setStops(stopsRes.data);
        } catch (err) { console.error("Fetch Error:", err); }
    };

    useEffect(() => { fetchData(); }, [tripId]);

    const handleAddStop = async (stopData) => {
        const token = localStorage.getItem('token');
        try {
            await axios.post('/api/itinerary/stops', { 
                ...stopData, 
                tripId, 
                orderIndex: stops.length,
                budget: stopData.estBudget || 500
            }, { headers: { Authorization: `Bearer ${token}` } });
            setShowStopForm(false);
            fetchData();
        } catch (err) { console.error("Add Error:", err); }
    };

    if (!trip) return <Layout><div style={{ padding: '4rem', textAlign: 'center' }}>Analyzing route data...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header Section (Matches Wireframe 5) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4rem', paddingBottom: '2rem', borderBottom: '1px solid #F3F4F6' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--primary)', marginBottom: '1rem' }}>
                            <div style={{ background: 'var(--primary-gradient)', padding: '6px', borderRadius: '8px' }}><Navigation size={16} color="white" /></div>
                            <span style={{ fontWeight: 800, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {trip.source_place.split(',')[0]} <ArrowRight size={14} /> {trip.destination_place.split(',')[0]}
                            </span>
                        </div>
                        <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-1.5px', marginBottom: '0.5rem' }}>Build Itinerary</h1>
                        <p style={{ color: 'var(--text-muted)', fontSize: '1.1rem' }}>Customize your journey with intelligent stop recommendations.</p>
                    </div>
                    <Link to={`/itinerary-view/${tripId}`} className="btn-primary" style={{ padding: '1rem 2rem', borderRadius: '16px' }}>View Final Timeline</Link>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1.6fr 1fr', gap: '4rem' }}>
                    {/* Journey Sections (Left Column) */}
                    <section>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <Compass size={24} color="var(--primary)" /> Journey Sections
                            </h3>
                            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>{stops.length} Stops Confirmed</span>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', position: 'relative' }}>
                            {/* Vertical Path Line */}
                            <div style={{ position: 'absolute', left: '23px', top: '20px', bottom: '20px', width: '2px', background: 'linear-gradient(to bottom, var(--primary) 0%, #eee 100%)', zIndex: 0 }}></div>

                            {stops.map((stop, i) => (
                                <div key={stop.id} className="premium-card animate-fade-in" style={{ padding: '2rem', marginLeft: '45px', position: 'relative', background: 'white' }}>
                                    <div style={{ position: 'absolute', left: '-53px', top: '22px', width: '18px', height: '18px', borderRadius: '50%', background: 'white', border: '4px solid var(--primary)', zIndex: 1 }}></div>
                                    
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div>
                                            <h4 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: '4px' }}>{stop.city_name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{stop.country}</p>
                                        </div>
                                        <div style={{ textAlign: 'right' }}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', fontWeight: 800, color: 'var(--accent)', background: '#F0FDF4', padding: '6px 12px', borderRadius: '50px' }}>
                                                <CheckCircle2 size={14} /> Confirmed
                                            </span>
                                        </div>
                                    </div>

                                    <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '1rem' }}>
                                        <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <Calendar size={18} color="var(--primary)" />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Date Range</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>{new Date(stop.arrival_date).toLocaleDateString()} - {new Date(stop.departure_date).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div style={{ padding: '1rem', background: '#F9FAFB', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <DollarSign size={18} color="var(--primary)" />
                                            <div>
                                                <p style={{ fontSize: '0.7rem', fontWeight: 700, color: '#9CA3AF', textTransform: 'uppercase' }}>Est. Budget</p>
                                                <p style={{ fontSize: '0.9rem', fontWeight: 800 }}>${stop.budget}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {showStopForm ? (
                                <div className="premium-card animate-fade-in" style={{ marginLeft: '45px', padding: '2.5rem', background: '#F9FAFB', border: '1px solid var(--primary)' }}>
                                    <h4 style={{ marginBottom: '1.5rem' }}>Add Manual Section</h4>
                                    <form onSubmit={(e) => { e.preventDefault(); handleAddStop(newStop); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                                        <input type="text" placeholder="City Name" onChange={e => setNewStop({...newStop, cityName: e.target.value})} required />
                                        <input type="text" placeholder="Country" onChange={e => setNewStop({...newStop, country: e.target.value})} required />
                                        <input type="date" onChange={e => setNewStop({...newStop, arrivalDate: e.target.value})} required />
                                        <input type="date" onChange={e => setNewStop({...newStop, departureDate: e.target.value})} required />
                                        <button type="submit" className="btn-primary" style={{ gridColumn: 'span 2', padding: '1rem' }}>Add to Itinerary</button>
                                        <button type="button" onClick={() => setShowStopForm(false)} style={{ gridColumn: 'span 2', background: 'none', border: 'none', color: 'var(--text-muted)', fontWeight: 700, cursor: 'pointer' }}>Cancel</button>
                                    </form>
                                </div>
                            ) : (
                                <button onClick={() => setShowStopForm(true)} style={{ marginLeft: '45px', border: '2px dashed #E5E7EB', background: 'white', padding: '2.5rem', borderRadius: '24px', cursor: 'pointer', color: '#9CA3AF', fontWeight: 700, transition: '0.3s' }} onMouseOver={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseOut={e => e.currentTarget.style.borderColor = '#E5E7EB'}>
                                    <Plus size={24} style={{ marginBottom: '8px' }} />
                                    <p>Add another Section</p>
                                </button>
                            )}
                        </div>
                    </section>

                    {/* Suggestions (Right Column) */}
                    <aside>
                        <div style={{ background: '#F0F9FF', padding: '2rem', borderRadius: '32px', marginBottom: '3rem', border: '1px solid #E0F2FE' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '1.5rem' }}>
                                <Sparkles size={28} color="var(--primary)" />
                                <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>Route Suggestions</h3>
                            </div>
                            <p style={{ color: '#0369A1', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>We've analyzed your route from <strong>{trip.source_place.split(',')[0]}</strong> to <strong>{trip.destination_place.split(',')[0]}</strong>.</p>
                            <p style={{ color: '#0369A1', fontSize: '0.85rem', fontWeight: 700 }}>Recommended stops are listed below.</p>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                            {suggestions.map((place, i) => (
                                <div key={i} className="premium-card animate-fade-in" style={{ padding: '0', overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                                    <div style={{ height: '180px', position: 'relative' }}>
                                        <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
                                        <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.9)', padding: '6px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, color: 'var(--primary)' }}>
                                            ${place.estBudget} Est.
                                        </div>
                                    </div>
                                    <div style={{ padding: '1.5rem' }}>
                                        <h5 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>{place.name}</h5>
                                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.5rem', lineHeight: 1.6 }}>{place.desc}</p>
                                        <button 
                                            className="btn-primary" 
                                            style={{ width: '100%', padding: '12px', fontSize: '0.9rem', borderRadius: '12px' }}
                                            onClick={() => handleAddStop({ 
                                                cityName: place.name.split(',')[0], 
                                                country: place.name.split(',')[1].trim(), 
                                                arrivalDate: trip.start_date, 
                                                departureDate: trip.end_date,
                                                estBudget: place.estBudget
                                            })}
                                        >
                                            Add to Route
                                        </button>
                                    </div>
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
