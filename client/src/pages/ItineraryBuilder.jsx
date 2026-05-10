import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Plus, Calendar, MapPin, DollarSign, ArrowRight, Sparkles, 
    Trash2, CheckCircle2, Navigation, Compass, ShoppingCart, 
    X, AlertCircle, TrendingUp, IndianRupee, Loader2, Landmark,
    Camera, Utensils, Building, Info, Globe
} from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [cart, setCart] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const getRealBudgetINR = (item) => {
        const rates = { 'museum': 800, 'monument': 1500, 'viewpoint': 500, 'hotel': 5000, 'theme_park': 2500, 'gallery': 1200 };
        return rates[item.category] || 1500;
    };

    const fetchRealWorldLandmarks = async (source, dest) => {
        setLoadingSuggestions(true);
        try {
            // 1. Get Coordinates for Source and Destination using Photon API
            const sourceRes = await axios.get(`https://photon.komoot.io/api/?q=${source}&limit=1`);
            const destRes = await axios.get(`https://photon.komoot.io/api/?q=${dest}&limit=1`);

            if (sourceRes.data.features.length && destRes.data.features.length) {
                const s = sourceRes.data.features[0].geometry.coordinates;
                const d = destRes.data.features[0].geometry.coordinates;
                
                // 2. Define Bounding Box for Overpass API
                const minLat = Math.min(s[1], d[1]) - 0.5;
                const maxLat = Math.max(s[1], d[1]) + 0.5;
                const minLon = Math.min(s[0], d[0]) - 0.5;
                const maxLon = Math.max(s[0], d[0]) + 0.5;

                // 3. Fetch Famous Landmarks from Overpass API (Real-time Global Data)
                const overpassQuery = `[out:json][timeout:25];(node["tourism"~"museum|monument|attraction|viewpoint|theme_park"](${minLat},${minLon},${maxLat},${maxLon}););out body 8;`;
                const overpassRes = await axios.get(`https://overpass-api.de/api/interpreter?data=${encodeURIComponent(overpassQuery)}`);
                
                const realLandmarks = overpassRes.data.elements.map(el => ({
                    name: el.tags.name || 'Famous Landmark',
                    category: el.tags.tourism || 'attraction',
                    desc: `A highly rated ${el.tags.tourism || 'spot'} located in this region.`,
                    img: `https://images.unsplash.com/photo-1548013146-72479768b0dd?auto=format&fit=crop&q=80&w=1000`, // Using a standard high-quality base
                    location: `${el.lat.toFixed(2)}, ${el.lon.toFixed(2)}`
                })).filter(l => l.name !== 'Famous Landmark');

                setSuggestions(realLandmarks);
            }
        } catch (err) { console.error("Dynamic Fetch Error:", err); }
        setLoadingSuggestions(false);
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        try {
            const tripRes = await axios.get(`/api/trips`, { headers });
            const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
            setTrip(currentTrip);

            if (currentTrip) {
                fetchRealWorldLandmarks(currentTrip.source_place, currentTrip.destination_place);
            }

            const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
            setStops(stopsRes.data);
        } catch (err) { console.error("Data Fetch Error:", err); }
    };

    useEffect(() => { fetchData(); }, [tripId]);

    const addToCart = (place) => {
        if (!cart.find(item => item.name === place.name)) {
            setCart([...cart, place]);
        }
    };

    const removeFromCart = (name) => {
        setCart(cart.filter(item => item.name !== name));
    };

    const finalizeRoute = async () => {
        const token = localStorage.getItem('token');
        for (const item of cart) {
            await axios.post('/api/itinerary/stops', { 
                cityName: item.name, 
                country: 'India', 
                arrivalDate: trip.start_date, 
                departureDate: trip.end_date,
                tripId, 
                orderIndex: stops.length,
                budget: getRealBudgetINR(item)
            }, { headers: { Authorization: `Bearer ${token}` } });
        }
        setCart([]);
        setShowConfirmModal(false);
        fetchData();
    };

    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Analyzing route...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.8rem', fontWeight: 900, letterSpacing: '-1.5px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                            <Globe size={40} color="var(--primary)" /> Real-Time Route Planner
                        </h1>
                        <p style={{ color: 'var(--text-muted)' }}>Live Data between <strong>{trip.source_place.split(',')[0]}</strong> and <strong>{trip.destination_place.split(',')[0]}</strong></p>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ position: 'relative' }}>
                            <button className="btn-primary" style={{ background: cart.length > 0 ? 'var(--primary-gradient)' : '#eee', color: cart.length > 0 ? 'white' : '#9CA3AF', borderRadius: '16px' }} onClick={() => cart.length > 0 && setShowConfirmModal(true)}>
                                <ShoppingCart size={20} /> My Route Cart ({cart.length})
                            </button>
                            {cart.length > 0 && <span className="animate-pulse" style={{ position: 'absolute', top: '-5px', right: '-5px', width: '12px', height: '12px', background: 'var(--accent)', borderRadius: '50%', border: '2px solid white' }}></span>}
                        </div>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '4rem' }}>
                    {/* Left Column: Live Landmarks */}
                    <section>
                        <h3 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '2.5rem', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Sparkles size={24} color="var(--primary)" /> Live Famous Suggestions
                        </h3>
                        
                        {loadingSuggestions ? (
                            <div style={{ textAlign: 'center', padding: '4rem' }}>
                                <Loader2 size={40} className="animate-spin" style={{ color: 'var(--primary)', marginBottom: '1rem' }} />
                                <p style={{ fontWeight: 700, color: 'var(--text-muted)' }}>Scanning Route for Landmarks...</p>
                            </div>
                        ) : (
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2.5rem' }}>
                                {suggestions.map((place, i) => (
                                    <div key={i} className="premium-card animate-fade-in" style={{ padding: 0, overflow: 'hidden', border: '1px solid #F3F4F6' }}>
                                        <div style={{ height: '220px', position: 'relative' }}>
                                            <img src={place.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} />
                                            <div style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.95)', padding: '6px 14px', borderRadius: '50px', fontSize: '0.7rem', fontWeight: 900, color: 'var(--primary)', textTransform: 'uppercase' }}>
                                                {place.category.replace('_', ' ')}
                                            </div>
                                        </div>
                                        <div style={{ padding: '1.8rem' }}>
                                            <h4 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.8rem' }}>{place.name}</h4>
                                            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '1.8rem', lineHeight: 1.6 }}>{place.desc}</p>
                                            <button 
                                                className="btn-primary" 
                                                style={{ width: '100%', borderRadius: '12px', background: cart.find(item => item.name === place.name) ? '#F0FDF4' : 'var(--primary-gradient)', color: cart.find(item => item.name === place.name) ? '#166534' : 'white' }}
                                                onClick={() => addToCart(place)}
                                            >
                                                {cart.find(item => item.name === place.name) ? <><CheckCircle2 size={18} /> In Cart</> : <><Plus size={18} /> Add to Route</>}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {suggestions.length === 0 && <p style={{ gridColumn: 'span 2', textAlign: 'center', color: '#9CA3AF' }}>No famous landmarks found on this specific route yet.</p>}
                            </div>
                        )}
                    </section>

                    {/* Right Column: Active Journey */}
                    <aside>
                        <div className="premium-card" style={{ padding: '2rem', marginBottom: '2rem', border: '1px solid #F3F4F6' }}>
                            <h4 style={{ marginBottom: '1.8rem', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.1rem' }}><Navigation size={20} color="var(--primary)" /> Finalized Route</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                                {stops.map((stop, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px', padding: '12px', background: '#F9FAFB', borderRadius: '14px' }}>
                                        <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                        <span style={{ fontSize: '0.9rem', fontWeight: 800 }}>{stop.city_name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </aside>
                </div>

                {/* Finalize Journey Modal */}
                {showConfirmModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', zIndex: 2000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(8px)' }}>
                        <div className="premium-card animate-scale-in" style={{ width: '650px', padding: '3.5rem' }}>
                            <h2 style={{ fontWeight: 900, fontSize: '1.8rem', marginBottom: '2rem' }}>Confirm Live Selections</h2>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '3rem' }}>
                                {cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.2rem', background: '#F9FAFB', borderRadius: '20px' }}>
                                        <div>
                                            <p style={{ fontWeight: 800 }}>{item.name}</p>
                                            <p style={{ fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 800 }}>₹ {getRealBudgetINR(item).toLocaleString('en-IN')} Est.</p>
                                        </div>
                                        <button onClick={() => removeFromCart(item.name)} style={{ color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={18} /></button>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-primary" style={{ width: '100%', padding: '1.3rem', fontSize: '1.1rem' }} onClick={finalizeRoute}>
                                Finalize Itinerary <ArrowRight size={20} />
                            </button>
                        </div>
                    </div>
                )}
            </div>
            
            <style>{`
                .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1); }
                @keyframes scaleIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
            `}</style>
        </Layout>
    );
};

export default ItineraryBuilder;
