import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Plus, Calendar, MapPin, DollarSign, ArrowRight, Sparkles, 
    Trash2, CheckCircle2, Navigation, Compass, ShoppingCart, 
    X, AlertCircle, TrendingUp, IndianRupee, Loader2, Landmark,
    Camera, Utensils, Building, Info, Globe, Map as MapIcon,
    History, Ship, BookOpen, ImageIcon, Eye, Star, ShieldCheck,
    Square, CheckSquare, List, Map as MapLayout, ArrowLeft
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

    const fetchDestinationGuide = async (destination) => {
        setLoadingSuggestions(true);
        try {
            const destRes = await axios.get(`https://photon.komoot.io/api/?q=${destination}&limit=1`);
            if (destRes.data.features.length) {
                const [lon, lat] = destRes.data.features[0].geometry.coordinates;
                const res = await axios.get(`/api/google/nearby-attractions?lat=${lat}&lon=${lon}`);
                const curated = res.data.filter(place => 
                    !place.name.includes('Limited') && 
                    !place.name.includes('Industries') && 
                    !place.name.includes('Fiber') &&
                    !place.name.includes('Society')
                );
                setSuggestions(curated);
            }
        } catch (err) { console.error("Discovery Error:", err); }
        setLoadingSuggestions(false);
    };

    const fetchData = async () => {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        const tripRes = await axios.get(`/api/trips`, { headers });
        const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
        setTrip(currentTrip);
        if (currentTrip) fetchDestinationGuide(currentTrip.destination_place);
        const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
        setStops(stopsRes.data);
    };

    useEffect(() => { fetchData(); }, [tripId]);

    const toggleSelection = (place) => {
        if (cart.find(item => item.name === place.name)) {
            setCart(cart.filter(item => item.name !== place.name));
        } else {
            setCart([...cart, place]);
        }
    };

    const finalizeRoute = async () => {
        const token = localStorage.getItem('token');
        for (const item of cart) {
            await axios.post('/api/itinerary/stops', { 
                cityName: item.name, country: 'India', 
                arrivalDate: trip.start_date, departureDate: trip.end_date,
                tripId, orderIndex: stops.length, budget: 4500
            }, { headers: { Authorization: `Bearer ${token}` } });
        }
        setCart([]);
        setShowConfirmModal(false);
        fetchData();
    };

    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Analyzing your destination...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '30px' }}>
                        <button onClick={() => navigate('/create-trip')} style={{ width: '60px', height: '60px', borderRadius: '18px', background: '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>
                            <ArrowLeft size={28} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '0.5rem', color: '#0F172A' }}>Explore {trip.destination_place.split(',')[0]}</h1>
                            <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem', fontWeight: 600 }}>Curating the best highlights for your journey.</p>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem' }}>
                        <button className="btn-secondary" style={{ padding: '1.2rem 2rem', borderRadius: '18px' }} onClick={() => navigate('/create-trip')}>
                            <Plus size={20} /> New Destination
                        </button>
                        <button className="btn-primary" style={{ padding: '1.2rem 2.8rem', borderRadius: '22px', fontSize: '1.1rem' }} onClick={() => cart.length > 0 && setShowConfirmModal(true)}>
                            <ShoppingCart size={22} /> Review Selected ({cart.length})
                        </button>
                    </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '6rem' }}>
                    <section>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '2.5rem' }}>
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900 }}>Visiting Places Suggestions</h3>
                            <div style={{ display: 'flex', gap: '10px', background: '#F1F5F9', padding: '6px', borderRadius: '12px' }}>
                                <button style={{ padding: '8px 15px', borderRadius: '8px', background: 'white', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.9rem' }}><List size={16} /> List View</button>
                            </div>
                        </div>

                        {loadingSuggestions ? (
                            <div style={{ padding: '8rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '40px', border: '2px dashed #E2E8F0' }}>
                                <Loader2 size={50} className="animate-spin" color="var(--primary)" style={{ marginBottom: '2rem' }} />
                                <h3 style={{ fontSize: '1.6rem', fontWeight: 900 }}>Fetching Data...</h3>
                            </div>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {suggestions.map((place, i) => (
                                    <div 
                                        key={i} 
                                        className="premium-card animate-fade-in" 
                                        style={{ 
                                            padding: '1.5rem', 
                                            background: 'white', 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            gap: '2.5rem', 
                                            cursor: 'pointer',
                                            border: cart.find(item => item.name === place.name) ? '2.3px solid var(--primary)' : '1px solid #F1F5F9',
                                            transition: 'all 0.2s ease'
                                        }}
                                        onClick={() => toggleSelection(place)}
                                    >
                                        <div style={{ color: cart.find(item => item.name === place.name) ? 'var(--primary)' : '#CBD5E1' }}>
                                            {cart.find(item => item.name === place.name) ? <CheckSquare size={34} /> : <Square size={34} />}
                                        </div>
                                        <div style={{ width: '130px', height: '130px', borderRadius: '20px', overflow: 'hidden', flexShrink: 0 }}>
                                            <img src={place.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548013146-72479768b0dd?auto=format&fit=crop&q=80&w=400' }} />
                                        </div>
                                        <div style={{ flexGrow: 1 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                                <h4 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1E293B' }}>{place.name}</h4>
                                                <span style={{ fontSize: '0.75rem', fontWeight: 900, background: '#F1F5F9', padding: '4px 10px', borderRadius: '50px', color: '#64748B', textTransform: 'uppercase' }}>{place.types[0].replace('_', ' ')}</span>
                                            </div>
                                            <p style={{ color: '#64748B', fontSize: '0.95rem', fontWeight: 600 }}>{place.address}</p>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: '#F59E0B', fontWeight: 900, fontSize: '0.9rem' }}>
                                                <Star size={16} fill="#F59E0B" /> {place.rating || 'New'}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </section>

                    <aside>
                        <div className="premium-card" style={{ padding: '2.5rem', background: 'white', position: 'sticky', top: '2rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2.5rem' }}>
                                <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: '#F0F9FF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <MapLayout size={20} color="var(--primary)" />
                                </div>
                                <h3 style={{ fontSize: '1.3rem', fontWeight: 900 }}>Route Timeline</h3>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                                {stops.map((stop, i) => (
                                    <div key={i} style={{ position: 'relative', paddingLeft: '45px' }}>
                                        <div style={{ position: 'absolute', left: '0', top: '5px', width: '24px', height: '24px', borderRadius: '50%', background: 'var(--primary)', border: '6px solid white', boxShadow: '0 0 0 4px #F1F5F9' }}></div>
                                        <p style={{ fontWeight: 900, color: '#1E293B' }}>{stop.city_name}</p>
                                        <p style={{ fontSize: '0.8rem', color: '#94A3B8', fontWeight: 700 }}>Confirmed</p>
                                    </div>
                                ))}
                                {stops.length === 0 && <p style={{ color: '#94A3B8', fontSize: '0.9rem', fontWeight: 700 }}>Select places to visit.</p>}
                            </div>

                            {stops.length > 0 && (
                                <button className="btn-secondary" style={{ width: '100%', marginTop: '4rem', padding: '1.2rem', borderRadius: '16px' }} onClick={() => navigate('/create-trip')}>
                                    <Plus size={20} /> Add Another Destination
                                </button>
                            )}
                        </div>
                    </aside>
                </div>

                {showConfirmModal && (
                    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.8)', zIndex: 3000, display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(20px)' }}>
                        <div className="premium-card animate-scale-in" style={{ width: '750px', padding: '4rem', background: 'white' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
                                <h2 style={{ fontSize: '2.2rem', fontWeight: 950 }}>Confirm Selections</h2>
                                <button onClick={() => setShowConfirmModal(false)} style={{ color: '#94A3B8' }}><X size={32} /></button>
                            </div>
                            
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem', marginBottom: '4rem', maxHeight: '400px', overflowY: 'auto' }}>
                                {cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '1.2rem', borderRadius: '20px' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                            <div style={{ width: '64px', height: '64px', borderRadius: '14px', overflow: 'hidden' }}><img src={item.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /></div>
                                            <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{item.name}</p>
                                        </div>
                                        <button onClick={() => toggleSelection(item)} style={{ color: '#EF4444' }}><Trash2 size={24} /></button>
                                    </div>
                                ))}
                            </div>

                            <button className="btn-primary" style={{ width: '100%', padding: '1.6rem', fontSize: '1.2rem', borderRadius: '24px' }} onClick={finalizeRoute}>
                                Confirm & Add to Trip <ArrowRight />
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ItineraryBuilder;
