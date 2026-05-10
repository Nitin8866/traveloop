import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { MapPin, Calendar, IndianRupee, Plus, ArrowLeft, MessageSquare, ShieldCheck, Share2, Info, FileText, Wallet } from 'lucide-react';

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

    const totalBudget = stops.reduce((sum, s) => sum + (parseFloat(s.budget) || 0), 0);

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                        <button onClick={() => navigate('/my-trips')} className="btn-icon" style={{ background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                            <ArrowLeft size={24} />
                        </button>
                        <div>
                            <h1 style={{ fontSize: '2rem', fontWeight: 900, letterSpacing: '-1px' }}>{trip.name} Master Plan</h1>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', marginTop: '4px' }}>
                                <MapPin size={16} color="var(--primary)" />
                                <span style={{ fontWeight: 600 }}>{trip.destination_place}</span>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.8rem' }}>
                        <button onClick={() => navigate(`/packing/${tripId}`)} style={{ padding: '8px 16px', borderRadius: '12px', background: '#F1F5F9', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <ShieldCheck size={16} /> Packing
                        </button>
                        <button onClick={() => navigate(`/notes/${tripId}`)} style={{ padding: '8px 16px', borderRadius: '12px', background: '#F1F5F9', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <MessageSquare size={16} /> Notes
                        </button>
                        <button onClick={() => navigate(`/invoice/${tripId}`)} style={{ padding: '8px 16px', borderRadius: '12px', background: '#F1F5F9', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <FileText size={16} /> Invoice
                        </button>
                        <button onClick={() => navigate(`/share/${tripId}`)} style={{ padding: '8px 16px', borderRadius: '12px', background: '#000', color: 'white', border: 'none', fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <Share2 size={16} /> Share
                        </button>
                    </div>
                </div>

                {/* Trip Summary Bar */}
                <div className="premium-card" style={{ padding: '1.5rem 2.5rem', marginBottom: '3rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', gap: '3rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <Calendar size={18} color="#64748B" />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>
                                {trip.start_date ? new Date(trip.start_date).toLocaleDateString() : 'No date'} — {trip.end_date ? new Date(trip.end_date).toLocaleDateString() : 'No date'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <MapPin size={18} color="#64748B" />
                            <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{stops.length} Sections</span>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: '#ECFDF5', padding: '8px 20px', borderRadius: '12px' }}>
                        <Wallet size={18} color="#059669" />
                        <span style={{ fontWeight: 800, color: '#059669', fontSize: '1rem' }}>₹{totalBudget.toLocaleString()}</span>
                    </div>
                </div>

                <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '3rem', paddingLeft: '1.5rem' }}>
                    {/* Continuous Vertical Timeline Line */}
                    {stops.length > 0 && (
                        <div style={{ position: 'absolute', top: '2rem', bottom: '2rem', left: '2rem', width: '4px', background: 'linear-gradient(to bottom, #3B82F6, #10B981, #EC4899)', borderRadius: '10px', zIndex: 0, opacity: 0.3 }}></div>
                    )}

                    {stops.length > 0 ? stops.map((stop, i) => (
                        <div key={stop.id} style={{ position: 'relative', display: 'flex', gap: '2.5rem', zIndex: 1, alignItems: 'stretch' }}>
                            {/* Glowing Timeline Dot */}
                            <div style={{ 
                                minWidth: '40px', height: '40px', borderRadius: '50%', 
                                background: 'linear-gradient(135deg, #0F172A, #1E293B)', 
                                display: 'flex', alignItems: 'center', justifyContent: 'center', 
                                color: 'white', fontWeight: 800, fontSize: '0.95rem',
                                boxShadow: '0 0 0 6px white, 0 8px 20px -5px rgba(0,0,0,0.1)',
                                transform: 'translateX(-22px)',
                                alignSelf: 'flex-start',
                                marginTop: '1.2rem',
                                border: '2px solid #E2E8F0'
                            }}>
                                {i + 1}
                            </div>
                            
                            {/* Place Timeline Card */}
                            <div className="premium-card animate-fade-in" style={{ flex: 1, padding: '1.5rem 2rem', background: 'white', border: '1px solid #E2E8F0', borderRadius: '24px', transition: 'all 0.3s ease' }}
                                 onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 15px 30px -10px rgba(0,0,0,0.08)'; }}
                                 onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 10px 30px -10px rgba(0,0,0,0.05)'; }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
                                    <div>
                                        <h2 style={{ fontSize: '1.4rem', fontWeight: 800, letterSpacing: '-0.3px' }}>Stop {i + 1}: {stop.city_name}</h2>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--primary)', marginTop: '4px' }}>
                                            <MapPin size={12} />
                                            <span style={{ fontWeight: 700, fontSize: '0.8rem' }}>
                                                {(stop.country && stop.country.toLowerCase() !== 'india') ? stop.country : trip.destination_place}
                                            </span>
                                        </div>
                                    </div>
                                    <div style={{ background: '#F8FAFC', padding: '8px 14px', borderRadius: '50px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <MapPin size={14} color="#64748B" />
                                        <span style={{ fontWeight: 700, fontSize: '0.8rem', color: '#475569' }}>Destination</span>
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div style={{ background: '#F8FAFC', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <Calendar size={18} color="#64748B" />
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: '#64748B', fontWeight: 800, marginBottom: '2px' }}>DATES</p>
                                            <p style={{ fontWeight: 700, color: '#1E293B', fontSize: '0.85rem' }}>
                                                {stop.arrival_date ? new Date(stop.arrival_date).toLocaleDateString() : 'TBD'} - {stop.departure_date ? new Date(stop.departure_date).toLocaleDateString() : 'TBD'}
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ background: '#ECFDF5', padding: '1rem', borderRadius: '16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <IndianRupee size={18} color="#059669" />
                                        <div>
                                            <p style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 800, marginBottom: '2px' }}>EST. BUDGET</p>
                                            <p style={{ fontWeight: 800, color: '#059669', fontSize: '0.95rem' }}>
                                                ₹{(parseFloat(stop.budget) || 5000).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )) : (
                        <div style={{ padding: '6rem', textAlign: 'center', background: '#F8FAFC', borderRadius: '32px', border: '2px dashed #CBD5E1', marginLeft: '1.5rem' }}>
                            <Info size={48} color="#94A3B8" style={{ marginBottom: '1.5rem', margin: '0 auto' }} />
                            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#64748B' }}>Your timeline is empty</h3>
                            <p style={{ color: '#94A3B8', marginTop: '0.5rem' }}>Click below to explore and add places to your journey timeline.</p>
                        </div>
                    )}

                    {/* Add Another Place Button (Bottom of Timeline) */}
                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: '2rem', zIndex: 1, marginTop: '0.5rem' }}>
                        <div style={{ 
                            minWidth: '40px', height: '40px', borderRadius: '50%', 
                            background: '#F1F5F9', border: '2px dashed #CBD5E1',
                            display: 'flex', alignItems: 'center', justifyContent: 'center', 
                            color: '#94A3B8', transform: 'translateX(-22px)'
                        }}>
                            <Plus size={16} />
                        </div>
                        <button 
                            onClick={() => navigate('/create-trip?tripId=' + tripId)}
                            style={{ 
                                flex: 1, padding: '1.2rem', background: '#F8FAFC', border: '2px dashed #CBD5E1', borderRadius: '20px', 
                                fontSize: '1rem', fontWeight: 700, color: '#64748B', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', cursor: 'pointer', transition: 'all 0.2s ease'
                            }}
                            onMouseOver={(e) => { e.currentTarget.style.background = '#F1F5F9'; e.currentTarget.style.borderColor = '#94A3B8'; e.currentTarget.style.color = '#475569'; }}
                            onMouseOut={(e) => { e.currentTarget.style.background = '#F8FAFC'; e.currentTarget.style.borderColor = '#CBD5E1'; e.currentTarget.style.color = '#64748B'; }}
                        >
                            <Plus size={20} /> Append New Destination
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
