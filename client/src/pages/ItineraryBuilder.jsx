import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Plus, ArrowRight, Sparkles, Trash2, CheckCircle2, ShoppingCart, 
    X, Star, Square, CheckSquare, List, Map as MapLayout, ArrowLeft,
    IndianRupee, Calendar, MapPin, Loader2, Info
} from 'lucide-react';

const ItineraryBuilder = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [cart, setCart] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [loadingSuggestions, setLoadingSuggestions] = useState(false);
    const [showSummary, setShowSummary] = useState(false);
    const [isFinalizing, setIsFinalizing] = useState(false);

    const fetchDestinationGuide = async (destination) => {
        setLoadingSuggestions(true);
        try {
            const destRes = await axios.get(`https://photon.komoot.io/api/?q=${destination}&limit=1`);
            if (destRes.data.features.length) {
                const [lon, lat] = destRes.data.features[0].geometry.coordinates;
                const res = await axios.get(`/api/google/nearby-attractions?lat=${lat}&lon=${lon}`);
                setSuggestions(res.data.filter(p => !p.name.includes('Limited') && !p.name.includes('Industries')));
            }
        } catch (err) { console.error(err); }
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
        } else { setCart([...cart, place]); }
    };

    const finalizeRoute = async () => {
        setIsFinalizing(true);
        const token = localStorage.getItem('token');
        try {
            for (const item of cart) {
                await axios.post('/api/itinerary/stops', { 
                    cityName: item.name, country: 'India', 
                    arrivalDate: trip.start_date, departureDate: trip.end_date,
                    tripId, orderIndex: stops.length, budget: 5000
                }, { headers: { Authorization: `Bearer ${token}` } });
            }
            setShowSummary(true);
        } catch (err) { console.error(err); }
        setIsFinalizing(false);
    };

    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Preparing Journey...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1200px', margin: '0 auto', paddingBottom: '120px' }}>
                
                {showSummary ? (
                    <div className="premium-card animate-scale-in" style={{ padding: '5rem', background: 'white' }}>
                        <div style={{ textAlign: 'center', marginBottom: '5rem' }}>
                            <div style={{ width: '100px', height: '100px', borderRadius: '50%', background: '#DCFCE7', color: '#166534', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                                <CheckCircle2 size={50} />
                            </div>
                            <h1 style={{ fontSize: '3rem', fontWeight: 950, letterSpacing: '-2px' }}>City Added Successfully!</h1>
                            <p style={{ fontSize: '1.2rem', color: 'var(--text-muted)' }}>Here is your destination summary for {trip.name}</p>
                        </div>

                        <div style={{ background: '#F8FAFC', borderRadius: '30px', padding: '4rem', marginBottom: '4rem' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '3rem', borderBottom: '2px solid #E2E8F0', paddingBottom: '3rem', marginBottom: '3rem' }}>
                                <div>
                                    <p style={{ fontWeight: 800, color: '#64748B', fontSize: '0.9rem', marginBottom: '8px' }}>CITY</p>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 950 }}>{trip.destination_place.split(',')[0]}</h3>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 800, color: '#64748B', fontSize: '0.9rem', marginBottom: '8px' }}>DATES</p>
                                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}</h3>
                                </div>
                                <div>
                                    <p style={{ fontWeight: 800, color: '#64748B', fontSize: '0.9rem', marginBottom: '8px' }}>TOTAL BUDGET</p>
                                    <h3 style={{ fontSize: '1.8rem', fontWeight: 950, color: '#059669' }}><IndianRupee size={24} style={{ display: 'inline', marginBottom: '4px' }} /> {(cart.length * 5000).toLocaleString()}</h3>
                                </div>
                            </div>

                            <h4 style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: '2.5rem' }}>Selected Tourist Places:</h4>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                {cart.map((item, i) => (
                                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '1.5rem', background: 'white', borderRadius: '20px', boxShadow: '0 4px 6px rgba(0,0,0,0.02)' }}>
                                        <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: 'var(--primary)' }}></div>
                                        <div>
                                            <p style={{ fontWeight: 900, fontSize: '1.1rem' }}>{item.name}</p>
                                            <p style={{ fontSize: '0.85rem', color: '#64748B' }}>{item.address}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'flex', gap: '2rem' }}>
                            <button className="btn-primary" style={{ flex: 1, padding: '1.6rem', fontSize: '1.2rem', borderRadius: '24px' }} onClick={() => navigate('/create-trip')}>
                                <Plus size={24} /> Add Another City Trip
                            </button>
                            <button className="btn-secondary" style={{ flex: 1, padding: '1.6rem', fontSize: '1.2rem', borderRadius: '24px' }} onClick={() => navigate('/dashboard')}>
                                View Full Itinerary <ArrowRight />
                            </button>
                        </div>
                    </div>
                ) : (
                    <>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '5rem' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '25px' }}>
                                <button onClick={() => navigate('/create-trip')} className="btn-icon"><ArrowLeft size={28} /></button>
                                <div>
                                    <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-3px' }}>Explore {trip.destination_place.split(',')[0]}</h1>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '1.2rem' }}>Select attractions to add to your journey timeline.</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 380px', gap: '6rem' }}>
                            <section>
                                {loadingSuggestions ? (
                                    <div style={{ padding: '10rem', textAlign: 'center' }}><Loader2 size={60} className="animate-spin" color="var(--primary)" /></div>
                                ) : (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {suggestions.map((place, i) => (
                                            <div 
                                                key={i} 
                                                className="premium-card animate-fade-in" 
                                                style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '2.5rem', cursor: 'pointer', border: cart.find(item => item.name === place.name) ? '2.5px solid var(--primary)' : '1px solid #F1F5F9' }}
                                                onClick={() => toggleSelection(place)}
                                            >
                                                <div style={{ color: cart.find(item => item.name === place.name) ? 'var(--primary)' : '#CBD5E1' }}>
                                                    {cart.find(item => item.name === place.name) ? <CheckSquare size={36} /> : <Square size={36} />}
                                                </div>
                                                <div style={{ width: '140px', height: '140px', borderRadius: '24px', overflow: 'hidden' }}>
                                                    <img src={place.photo} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={place.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548013146-72479768b0dd?auto=format&fit=crop&q=80&w=400' }} />
                                                </div>
                                                <div style={{ flex: 1 }}>
                                                    <h4 style={{ fontSize: '1.5rem', fontWeight: 900, marginBottom: '8px' }}>{place.name}</h4>
                                                    <p style={{ color: '#64748B', fontWeight: 600 }}>{place.address}</p>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '12px', color: '#F59E0B', fontWeight: 900 }}>
                                                        <Star size={18} fill="#F59E0B" /> {place.rating || '4.5'}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </section>

                            <aside>
                                <div className="premium-card" style={{ padding: '2.5rem', background: 'white', position: 'sticky', top: '2rem' }}>
                                    <h3 style={{ fontSize: '1.3rem', fontWeight: 900, marginBottom: '2.5rem' }}>Current Selection ({cart.length})</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                                        {cart.map((item, i) => (
                                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                                <CheckCircle2 size={18} color="var(--primary)" />
                                                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{item.name}</span>
                                            </div>
                                        ))}
                                        {cart.length === 0 && <p style={{ color: '#94A3B8' }}>No places selected yet.</p>}
                                    </div>
                                </div>
                            </aside>
                        </div>

                        {/* STICKY BOTTOM BAR */}
                        <div style={{ position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)', width: '90%', maxWidth: '1100px', background: 'rgba(15, 23, 42, 0.9)', backdropFilter: 'blur(20px)', padding: '2rem 4rem', borderRadius: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)', border: '1px solid rgba(255,255,255,0.1)' }}>
                            <div style={{ color: 'white' }}>
                                <p style={{ fontSize: '0.9rem', fontWeight: 800, opacity: 0.7, textTransform: 'uppercase' }}>Review Selection</p>
                                <h4 style={{ fontSize: '1.4rem', fontWeight: 900 }}>{cart.length} Destinations Selected</h4>
                            </div>
                            <button 
                                className="btn-primary" 
                                style={{ padding: '1.2rem 3rem', fontSize: '1.1rem', borderRadius: '18px', background: 'var(--primary-gradient)' }}
                                disabled={cart.length === 0 || isFinalizing}
                                onClick={finalizeRoute}
                            >
                                {isFinalizing ? <Loader2 className="animate-spin" /> : <><CheckCircle2 size={22} /> Confirm & Add to Journey</>}
                            </button>
                        </div>
                    </>
                )}
            </div>
        </Layout>
    );
};

export default ItineraryBuilder;
