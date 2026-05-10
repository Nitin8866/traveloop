import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { MapPin, Calendar, Compass, ArrowRight, Sparkles, Loader2, ArrowLeft, ChevronDown } from 'lucide-react';

const CreateTrip = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [destinationSearch, setDestinationSearch] = useState('');
    const [destinationResults, setDestinationResults] = useState([]);
    const [myTrips, setMyTrips] = useState([]);
    const [isExistingTrip, setIsExistingTrip] = useState(false);
    
    const [formData, setFormData] = useState(() => {
        const saved = localStorage.getItem('traveloop_draft_trip');
        return saved ? JSON.parse(saved) : {
            id: null,
            name: '',
            description: '',
            startDate: '',
            endDate: '',
            destinationPlace: ''
        };
    });

    useEffect(() => {
        const fetchTrips = async () => {
            const token = localStorage.getItem('token');
            const res = await axios.get('/api/trips', { headers: { Authorization: `Bearer ${token}` } });
            setMyTrips(res.data);
        };
        fetchTrips();
        if (formData.destinationPlace) setDestinationSearch(formData.destinationPlace);
    }, []);

    useEffect(() => {
        localStorage.setItem('traveloop_draft_trip', JSON.stringify(formData));
    }, [formData]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (destinationSearch.length > 2) {
                const res = await axios.get(`https://photon.komoot.io/api/?q=${destinationSearch}&limit=5`);
                setDestinationResults(res.data.features);
            } else { setDestinationResults([]); }
        }, 300);
        return () => clearTimeout(timer);
    }, [destinationSearch]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!formData.destinationPlace) return alert('Please select a destination.');
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            let tripId = formData.id;
            
            if (!tripId) {
                const res = await axios.post('/api/trips', formData, { headers: { Authorization: `Bearer ${token}` } });
                tripId = res.data.id;
            }
            
            // PASS THE NEW CITY IN THE URL so ItineraryBuilder knows which one to fetch
            navigate(`/itinerary/${tripId}?city=${encodeURIComponent(formData.destinationPlace)}`);
        } catch (error) { console.error(error); }
        setLoading(false);
    };

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <button onClick={() => navigate('/')} className="btn-icon" style={{ width: '50px', height: '50px', borderRadius: '15px', background: '#F1F5F9', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '3rem', fontWeight: 900, letterSpacing: '-2px' }}>Plan Next Destination</h1>
                </div>

                <form onSubmit={handleSubmit} className="premium-card" style={{ padding: '4rem', background: 'white' }}>
                    <div style={{ display: 'grid', gap: '2.5rem' }}>
                        
                        <div className="form-group">
                            <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>Add to Journey (Select Existing or New)</label>
                            <div style={{ position: 'relative' }}>
                                <select 
                                    value={formData.id || ''}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600, appearance: 'none', cursor: 'pointer' }}
                                    onChange={(e) => {
                                        const selected = myTrips.find(t => t.id === parseInt(e.target.value));
                                        if (selected) {
                                            setFormData({...formData, id: selected.id, name: selected.name, startDate: selected.start_date?.split('T')[0], endDate: selected.end_date?.split('T')[0]});
                                            setIsExistingTrip(true);
                                        } else {
                                            setFormData({...formData, id: null, name: ''});
                                            setIsExistingTrip(false);
                                        }
                                    }}
                                >
                                    <option value="">+ Create New Trip Journey</option>
                                    {myTrips.map(t => <option key={t.id} value={t.id}>{t.name} (Started: {new Date(t.start_date).toLocaleDateString()})</option>)}
                                </select>
                                <ChevronDown size={20} style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
                            </div>
                        </div>

                        {!isExistingTrip && (
                            <div className="form-group">
                                <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>New Journey Name</label>
                                <input 
                                    type="text" value={formData.name}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                    required
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>Destination City</label>
                            <div style={{ position: 'relative' }}>
                                <MapPin size={20} style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(-50%)', color: '#EC4899' }} />
                                <input 
                                    type="text" value={destinationSearch}
                                    style={{ width: '100%', padding: '1.2rem 1.2rem 1.2rem 3.5rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontSize: '1rem', fontWeight: 600 }}
                                    onChange={(e) => { setDestinationSearch(e.target.value); setFormData({...formData, destinationPlace: e.target.value}); }}
                                    required
                                />
                                {destinationResults.length > 0 && (
                                    <div style={{ position: 'absolute', top: '100%', left: 0, right: 0, background: 'white', zIndex: 100, borderRadius: '18px', marginTop: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', border: '1px solid #F1F5F9', overflow: 'hidden' }}>
                                        {destinationResults.map((r, i) => (
                                            <div key={i} style={{ padding: '15px 25px', cursor: 'pointer', borderBottom: '1px solid #F8FAFC', fontWeight: 600 }} onClick={() => {
                                                const name = `${r.properties.name || ''}, ${r.properties.city || ''}`;
                                                setFormData({...formData, destinationPlace: name});
                                                setDestinationSearch(name);
                                                setDestinationResults([]);
                                            }}>
                                                {r.properties.name}, {r.properties.city}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* RESTORED DATE TAB */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                            <div className="form-group">
                                <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>Start Date</label>
                                <input 
                                    type="date" value={formData.startDate}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, startDate: e.target.value})}
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label style={{ fontWeight: 800, marginBottom: '12px', display: 'block' }}>End Date</label>
                                <input 
                                    type="date" value={formData.endDate}
                                    style={{ width: '100%', padding: '1.2rem', borderRadius: '18px', border: '2px solid #F1F5F9', fontWeight: 600 }}
                                    onChange={(e) => setFormData({...formData, endDate: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn-primary" style={{ padding: '1.5rem', borderRadius: '24px' }} disabled={loading}>
                            {loading ? <Loader2 className="animate-spin" /> : <><Sparkles size={24} /> Explore Destination <ArrowRight /></>}
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default CreateTrip;
