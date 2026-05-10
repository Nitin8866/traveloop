import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, SlidersHorizontal, LayoutGrid, MapPin, Star, Heart, ArrowRight } from 'lucide-react';

const Explore = () => {
    const results = [
        { name: 'Paragliding in Interlaken', location: 'Switzerland', price: '$150', rating: 4.9, img: 'https://images.unsplash.com/photo-1533310266094-8898a03807dd?auto=format&fit=crop&w=300' },
        { name: 'Sushi Making Workshop', location: 'Tokyo, Japan', price: '$85', rating: 5.0, img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=300' },
        { name: 'Hot Air Balloon Ride', location: 'Cappadocia, Turkey', price: '$220', rating: 4.8, img: 'https://images.unsplash.com/photo-1520440229334-962aee4d1b9d?auto=format&fit=crop&w=300' },
        { name: 'Gondola Serenade', location: 'Venice, Italy', price: '$120', rating: 4.7, img: 'https://images.unsplash.com/photo-1523906834658-6e24ef2386f9?auto=format&fit=crop&w=300' },
        { name: 'Safari Adventure', location: 'Maasai Mara, Kenya', price: '$450', rating: 4.9, img: 'https://images.unsplash.com/photo-1516426122078-c23e76319801?auto=format&fit=crop&w=300' },
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Explore Activities</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Find the best experiences for your next trip.</p>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search for activities (e.g. Paragliding)..." style={{ width: '100%', paddingLeft: '48px' }} />
                    </div>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </div>

                {/* Results List (Matches Wireframe) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '0.5rem' }}>Results</h3>
                    {results.map((item, i) => (
                        <div key={i} className="premium-card animate-fade-in" style={{ padding: '1rem', display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <div style={{ width: '150px', height: '100px', borderRadius: '16px', overflow: 'hidden' }}>
                                <img src={item.img} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt={item.name} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{item.name}</h4>
                                    <button style={{ background: 'none', border: 'none', color: '#9CA3AF' }}><Heart size={20} /></button>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '8px' }}><MapPin size={14} /> {item.location}</p>
                                <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#F59E0B', fontWeight: 700 }}><Star size={14} fill="#F59E0B" /> {item.rating}</div>
                                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{item.price}</div>
                                </div>
                            </div>
                            <button className="btn-primary" style={{ padding: '12px 25px' }}>Book Now <ArrowRight size={18} /></button>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Explore;
