import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { MapPin, Calendar, IndianRupee, Copy, Share2, Compass, Globe } from 'lucide-react';

const PublicItinerary = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [trip, setTrip] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPublicData = async () => {
            try {
                const res = await axios.get(`/api/trips/public/${tripId}`);
                setTrip(res.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchPublicData();
    }, [tripId]);

    const copyTrip = () => {
        alert('Trip copied to your account! (Logic would create a copy for the logged-in user)');
    };

    if (loading) return <div style={{ padding: '10rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Loading Shared Journey...</div>;
    if (!trip) return <div style={{ padding: '10rem', textAlign: 'center', fontFamily: 'Inter, sans-serif' }}>Journey not found or is private.</div>;

    return (
        <div style={{ minHeight: '100vh', background: '#F8FAFC', fontFamily: 'Inter, sans-serif', padding: '4rem 2rem' }}>
            <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
                
                <div style={{ background: 'white', borderRadius: '40px', padding: '5rem', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.05)', marginBottom: '4rem' }}>
                    <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
                        <div style={{ width: '80px', height: '80px', background: '#DBEAFE', color: '#1D4ED8', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 2rem' }}>
                            <Globe size={40} />
                        </div>
                        <h1 style={{ fontSize: '3.5rem', fontWeight: 950, letterSpacing: '-3px', marginBottom: '1rem' }}>{trip.name}</h1>
                        <p style={{ color: '#64748B', fontSize: '1.2rem', fontWeight: 500 }}>A journey shared with you via Traveloop</p>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '4rem' }}>
                        <button onClick={copyTrip} style={{ padding: '1.2rem 3rem', background: '#000', color: 'white', borderRadius: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Copy size={20} /> Copy this Trip
                        </button>
                        <button onClick={() => window.print()} style={{ padding: '1.2rem 3rem', background: '#F1F5F9', color: '#0F172A', borderRadius: '18px', fontWeight: 800, border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <Share2 size={20} /> Export PDF
                        </button>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                        {trip.stops?.map((stop, i) => (
                            <div key={i} style={{ padding: '3rem', background: '#F8FAFC', borderRadius: '32px', border: '1px solid #E2E8F0' }}>
                                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ width: '40px', height: '40px', background: '#000', color: '#fff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>{i+1}</span>
                                    {stop.city_name}
                                </h3>
                                <div style={{ display: 'flex', gap: '2rem' }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#64748B' }}>
                                        <Calendar size={18} /> {new Date(stop.arrival_date).toLocaleDateString()}
                                    </span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, color: '#059669' }}>
                                        <IndianRupee size={18} /> ₹{stop.budget?.toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div style={{ textAlign: 'center' }}>
                    <p style={{ fontWeight: 800, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '2px', fontSize: '0.8rem', marginBottom: '1.5rem' }}>Powered By</p>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <div style={{ width: '40px', height: '40px', background: 'var(--primary-gradient)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                            <Compass size={24} />
                        </div>
                        <span style={{ fontSize: '1.8rem', fontWeight: 950, letterSpacing: '-1.5px' }}>Traveloop</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicItinerary;
