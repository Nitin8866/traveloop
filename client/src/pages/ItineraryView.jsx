import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { MapPin, Calendar, IndianRupee, Plus, ArrowLeft, MoreHorizontal, MessageSquare, Info, ShieldCheck, Share2 } from 'lucide-react';

const ItineraryView = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [stops, setStops] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                const tripRes = await axios.get(`/api/trips`, { headers });
                const currentTrip = tripRes.data.find(t => t.id === parseInt(tripId));
                setTrip(currentTrip);
                
                const stopsRes = await axios.get(`/api/itinerary/stops/${tripId}`, { headers });
                setStops(stopsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, [tripId]);

    if (loading) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}>Loading Master Itinerary...</div></Layout>;
    if (!trip) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}>Trip not found.</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => navigate('/my-trips')} className="btn-icon" style={{ background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-2px' }}>{trip.name} Master Plan</h1>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button onClick={() => navigate(`/packing/${tripId}`)} style={{ padding: '10px 20px', borderRadius: '15px', background: '#F1F5F9', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <ShieldCheck size={18} /> Packing
                        </button>
                        <button onClick={() => navigate(`/notes/${tripId}`)} style={{ padding: '10px 20px', borderRadius: '15px', background: '#F1F5F9', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MessageSquare size={18} /> Notes
                        </button>
                        <button onClick={() => navigate(`/share/${tripId}`)} style={{ padding: '10px 20px', borderRadius: '15px', background: '#000', color: 'white', border: 'none', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <Share2 size={18} /> Share
                        </button>
                    </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {stops.length > 0 ? stops.map((stop, i) => (
                        <div key={stop.id} className="premium-card animate-fade-in" style={{ padding: '3.5rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '32px' }}>
                            <div style={{ marginBottom: '2.5rem' }}>
                                <h2 style={{ fontSize: '1.6rem', fontWeight: 950, marginBottom: '1.5rem' }}>Section {i + 1}:</h2>
                                <p style={{ color: '#475569', lineHeight: 1.8, fontSize: '1.05rem', fontWeight: 500 }}>
                                    All the necessary information about this section. This can be anything like travel section, hotel or any other activity in <strong>{stop.city_name}</strong>.
                                </p>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
                                <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '1.5rem 2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <Calendar size={20} color="#64748B" />
                                    <p style={{ fontWeight: 800, color: '#1E293B' }}>
                                        Date Range: {new Date(stop.arrival_date).toLocaleDateString()} to {new Date(stop.departure_date).toLocaleDateString()}
                                    </p>
                                </div>
                                <div style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0', padding: '1.5rem 2rem', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <IndianRupee size={20} color="#059669" />
                                    <p style={{ fontWeight: 800, color: '#1E293B' }}>
                                        Budget of this section: ₹{stop.budget?.toLocaleString() || '5,000'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '6rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '32px', border: '2px dashed #CBD5E1' }}>
                            <Info size={48} color="#94A3B8" style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#64748B' }}>No sections added yet</h3>
                        </div>
                    )}

                    {/* Add Another Section Button (Matches Wireframe) */}
                    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                        <button 
                            onClick={() => navigate('/create-trip')}
                            style={{ 
                                padding: '1.8rem 4rem', 
                                background: 'white', 
                                border: '2.5px solid #000', 
                                borderRadius: '24px', 
                                fontSize: '1.3rem', 
                                fontWeight: 950, 
                                display: 'inline-flex', 
                                alignItems: 'center', 
                                gap: '15px',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                boxShadow: '0 10px 20px rgba(0,0,0,0.05)'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#000'; e.currentTarget.style.color = '#fff'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#white'; e.currentTarget.style.color = '#000'; }}
                        >
                            <Plus size={32} /> Add another Section
                        </button>
                    </div>
                </div>
            </div>
            <style>{`
                .btn-icon:hover { background: #E2E8F0 !important; transform: scale(1.05); transition: all 0.2s; }
            `}</style>
        </Layout>
    );
};

export default ItineraryView;
