import React, { useState } from 'react';
import Layout from '../components/layout/Layout';
import { Search, SlidersHorizontal, LayoutGrid, Plus, FileText, Calendar, MapPin, Edit3, Trash2 } from 'lucide-react';

const TripNotes = () => {
    const [filter, setFilter] = useState('All');
    
    const notes = [
        { 
            title: 'Hotel check-in details - Rome stop', 
            details: 'Check-in after 2pm, room 302, breakfast included (7-10am)', 
            date: 'Day 3, June 14 2024',
            category: 'hotel'
        },
        { 
            title: 'Flight details - Paris to Rome', 
            details: 'Flight AF1234, Gate B12, Departs at 10:30 AM. Need to be at airport by 8 AM.', 
            date: 'Day 3, June 14 2024',
            category: 'travel'
        },
        { 
            title: 'Restaurant Recommendation - Trastevere', 
            details: 'Try the Cacio e Pepe at "Tonnarello". Highly recommended by locals!', 
            date: 'Day 4, June 15 2024',
            category: 'dining'
        }
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Trip Notes</h1>
                        <p style={{ color: 'var(--text-muted)' }}>Keep your important travel details organized in one place.</p>
                    </div>
                    <button className="btn-primary"><Plus size={18} /> Add Note</button>
                </div>

                {/* Filter Bar (Matches Wireframe) */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search notes..." style={{ width: '100%', paddingLeft: '48px' }} />
                    </div>
                    <div style={{ display: 'flex', background: 'white', borderRadius: '12px', border: '1px solid #eee', padding: '4px' }}>
                        {['All', 'by Day', 'by Stop'].map(f => (
                            <button 
                                key={f} 
                                onClick={() => setFilter(f)}
                                style={{ 
                                    padding: '8px 16px', 
                                    borderRadius: '10px', 
                                    border: 'none', 
                                    background: filter === f ? 'var(--primary-gradient)' : 'transparent',
                                    color: filter === f ? 'white' : 'var(--text-muted)',
                                    fontWeight: 700,
                                    fontSize: '0.85rem',
                                    cursor: 'pointer',
                                    transition: '0.3s'
                                }}
                            >
                                {f}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Notes List (Matches Wireframe) */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {notes.map((note, i) => (
                        <div key={i} className="premium-card animate-fade-in" style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem' }}>
                            <div style={{ background: '#F9FAFB', color: 'var(--primary)', padding: '12px', borderRadius: '14px', height: 'fit-content' }}>
                                <FileText size={24} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                                    <h4 style={{ fontSize: '1.2rem', fontWeight: 800 }}>{note.title}</h4>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button style={{ padding: '6px', borderRadius: '8px', border: '1px solid #eee', color: '#9CA3AF' }}><Edit3 size={14} /></button>
                                        <button style={{ padding: '6px', borderRadius: '8px', border: '1px solid #eee', color: 'var(--error)', background: '#FEF2F2' }}><Trash2 size={14} /></button>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '1rem', lineHeight: 1.5 }}>{note.details}</p>
                                <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.8rem', fontWeight: 700 }}>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={12} /> {note.date}</span>
                                    <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={12} /> Rome stop</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default TripNotes;
