import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { Search, SlidersHorizontal, LayoutGrid, MapPin, Star, Heart, ArrowRight, Loader2, Compass } from 'lucide-react';

const Explore = () => {
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searched, setSearched] = useState(false);

    // Default curated results to show on load
    const defaultResults = [
        { name: 'Paragliding in Interlaken', location: 'Switzerland', price: '₹12,500', rating: 4.9, img: 'https://images.unsplash.com/photo-1533310266094-8898a03807dd?auto=format&fit=crop&w=300' },
        { name: 'Sushi Making Workshop', location: 'Tokyo, Japan', price: '₹7,000', rating: 5.0, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300' },
        { name: 'Hot Air Balloon Ride', location: 'Cappadocia, Turkey', price: '₹18,000', rating: 4.8, img: 'https://images.unsplash.com/photo-1520440229334-962aee4d1b9d?auto=format&fit=crop&w=300' },
        { name: 'Gondola Serenade', location: 'Venice, Italy', price: '₹10,000', rating: 4.7, img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=300' },
        { name: 'Safari Adventure', location: 'Maasai Mara, Kenya', price: '₹37,500', rating: 4.9, img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=300' },
    ];

    const handleSearch = async (e) => {
        e?.preventDefault();
        if (!searchQuery.trim()) return;
        
        setLoading(true);
        setSearched(true);
        try {
            // First geocode the search query to get coordinates
            const geoRes = await axios.get(`https://photon.komoot.io/api/?q=${encodeURIComponent(searchQuery)}&limit=1`);
            
            if (geoRes.data.features.length > 0) {
                const [lon, lat] = geoRes.data.features[0].geometry.coordinates;
                const token = localStorage.getItem('token');
                
                // Use our Google Places proxy
                const res = await axios.get(`/api/google/nearby-attractions?lat=${lat}&lon=${lon}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                
                setResults(res.data.filter(p => p.name && !p.name.includes('Limited')).map(place => ({
                    name: place.name,
                    location: place.address || searchQuery,
                    price: `₹${Math.floor(Math.random() * 5000 + 1000).toLocaleString()}`,
                    rating: place.rating || 4.5,
                    img: place.photo || 'https://images.unsplash.com/photo-1548013146-72479768b0dd?auto=format&fit=crop&w=300'
                })));
            } else {
                setResults([]);
            }
        } catch (err) {
            console.error(err);
            setResults([]);
        }
        setLoading(false);
    };

    const displayResults = searched ? results : defaultResults;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Activities</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find the best experiences for your next trip.</p>
                </div>

                {/* Search & Filters */}
                <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input 
                            type="text" 
                            placeholder="Search a city (e.g. Mumbai, Paris, Tokyo)..." 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            style={{ width: '100%', paddingLeft: '48px' }} 
                        />
                    </div>
                    <button type="submit" className="btn-primary" style={{ padding: '0 24px' }}><Search size={18} /> Search</button>
                    <button type="button" style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button type="button" style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button type="button" style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </form>

                {/* Results */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>
                        {searched ? `Results for "${searchQuery}"` : 'Results'}
                    </h3>

                    {loading ? (
                        <div style={{ padding: '5rem', textAlign: 'center' }}>
                            <Loader2 size={40} className="animate-spin" color="var(--primary)" />
                            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Searching nearby attractions...</p>
                        </div>
                    ) : displayResults.length > 0 ? (
                        displayResults.map((item, i) => (
                            <div key={i} className="premium-card animate-fade-in" style={{ padding: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                                <div style={{ width: '150px', height: '100px', borderRadius: '16px', overflow: 'hidden', flexShrink: 0 }}>
                                    <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1548013146-72479768b0dd?auto=format&fit=crop&w=300' }} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                        <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.name}</h4>
                                        <button style={{ background: 'none', border: 'none', color: '#9CA3AF', cursor: 'pointer' }}><Heart size={20} /></button>
                                    </div>
                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}><MapPin size={14} /> {item.location}</p>
                                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}><Star size={14} fill="#F59E0B" /> {item.rating}</div>
                                        <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{item.price}</div>
                                    </div>
                                </div>
                                <button onClick={() => navigate('/create-trip')} className="btn-primary" style={{ padding: '12px 25px' }}>Add to Trip <ArrowRight size={18} /></button>
                            </div>
                        ))
                    ) : (
                        <div style={{ textAlign: 'center', padding: '4rem', border: '2px dashed #E2E8F0', borderRadius: '20px', color: '#94A3B8' }}>
                            <Compass size={48} style={{ marginBottom: '1rem' }} />
                            <h3 style={{ fontWeight: 800, marginBottom: '0.5rem' }}>No results found</h3>
                            <p>Try searching for a different city or destination.</p>
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
};

export default Explore;
