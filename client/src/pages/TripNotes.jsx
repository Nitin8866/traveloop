import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/layout/Layout';
import { 
    Plus, FileText, Calendar, MapPin, Trash2, 
    ArrowLeft, Loader2, StickyNote, Clock
} from 'lucide-react';

const TripNotes = () => {
    const { tripId } = useParams();
    const navigate = useNavigate();
    const [notes, setNotes] = useState([]);
    const [stops, setStops] = useState([]);
    const [newNote, setNewNote] = useState('');
    const [selectedStop, setSelectedStop] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                const headers = { Authorization: `Bearer ${token}` };
                
                const [notesRes, stopsRes] = await Promise.all([
                    axios.get(`/api/notes/${tripId}`, { headers }),
                    axios.get(`/api/itinerary/stops/${tripId}`, { headers })
                ]);
                
                setNotes(notesRes.data);
                setStops(stopsRes.data);
            } catch (err) { console.error(err); }
            setLoading(false);
        };
        fetchData();
    }, [tripId]);

    const addNote = async (e) => {
        e.preventDefault();
        if (!newNote) return;
        try {
            const token = localStorage.getItem('token');
            const res = await axios.post('/api/notes', { 
                tripId, 
                stopId: selectedStop || null, 
                content: newNote 
            }, { headers: { Authorization: `Bearer ${token}` } });
            
            setNotes([{ ...res.data, created_at: new Date().toISOString() }, ...notes]);
            setNewNote('');
        } catch (err) { console.error(err); }
    };

    const deleteNote = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`/api/notes/${id}`, { headers: { Authorization: `Bearer ${token}` } });
            setNotes(notes.filter(n => n.id !== id));
        } catch (err) { console.error(err); }
    };

    if (loading) return <Layout><div style={{ padding: '5rem', textAlign: 'center' }}><Loader2 className="animate-spin" /> Fetching journals...</div></Layout>;

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '4rem' }}>
                    <button onClick={() => navigate(-1)} className="btn-icon" style={{ background: '#F8FAFC', border: 'none', padding: '12px', borderRadius: '12px', cursor: 'pointer' }}>
                        <ArrowLeft size={24} />
                    </button>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 950, letterSpacing: '-2px' }}>Trip Journal & Notes</h1>
                </div>

                <form onSubmit={addNote} className="premium-card" style={{ padding: '2.5rem', background: 'white', marginBottom: '3rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <textarea 
                            placeholder="Write your note or reminder here... (e.g. Hotel check-in info, local contacts)" 
                            value={newNote} onChange={(e) => setNewNote(e.target.value)}
                            style={{ width: '100%', minHeight: '120px', padding: '1.2rem', borderRadius: '15px', border: '2px solid #F1F5F9', fontWeight: 600, fontFamily: 'inherit', resize: 'vertical' }}
                        />
                        <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                            <div style={{ flex: 1, position: 'relative' }}>
                                <MapPin size={18} style={{ position: 'absolute', left: '15px', top: '50%', transform: 'translateY(-50%)', color: '#94A3B8' }} />
                                <select 
                                    value={selectedStop} onChange={(e) => setSelectedStop(e.target.value)}
                                    style={{ width: '100%', padding: '1rem 1rem 1rem 3rem', borderRadius: '15px', border: '2px solid #F1F5F9', fontWeight: 600, background: 'white', appearance: 'none' }}
                                >
                                    <option value="">General Trip Note</option>
                                    {stops.map(stop => <option key={stop.id} value={stop.id}>Linked to: {stop.city_name}</option>)}
                                </select>
                            </div>
                            <button type="submit" className="btn-primary" style={{ padding: '1rem 3rem', borderRadius: '15px' }}>
                                <Plus size={20} /> Save Note
                            </button>
                        </div>
                    </div>
                </form>

                <div style={{ display: 'grid', gap: '2rem' }}>
                    {notes.map(note => {
                        const stop = stops.find(s => s.id === note.stop_id);
                        return (
                            <div key={note.id} className="premium-card animate-fade-in" style={{ padding: '2rem', display: 'flex', gap: '2rem', background: 'white', border: '1px solid #E2E8F0' }}>
                                <div style={{ background: '#FFF7ED', color: '#C2410C', padding: '12px', borderRadius: '15px', height: 'fit-content' }}>
                                    <StickyNote size={28} />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                                            <span style={{ background: '#F1F5F9', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, color: '#64748B', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                <Clock size={12} /> {new Date(note.created_at).toLocaleDateString()}
                                            </span>
                                            {stop && (
                                                <span style={{ background: '#DBEAFE', padding: '4px 12px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, color: '#1D4ED8', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <MapPin size={12} /> {stop.city_name}
                                                </span>
                                            )}
                                        </div>
                                        <button onClick={() => deleteNote(note.id)} style={{ color: '#FDA4AF', background: 'none', border: 'none', cursor: 'pointer' }}><Trash2 size={20} /></button>
                                    </div>
                                    <p style={{ fontSize: '1.1rem', fontWeight: 500, lineHeight: 1.6, color: '#1E293B', whiteSpace: 'pre-wrap' }}>{note.content}</p>
                                </div>
                            </div>
                        );
                    })}
                    {notes.length === 0 && (
                        <div style={{ textAlign: 'center', padding: '5rem', border: '2px dashed #E2E8F0', borderRadius: '32px', color: '#94A3B8' }}>
                            <FileText size={48} style={{ marginBottom: '1.5rem' }} />
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>No notes yet</h3>
                            <p>Write down hotel info, contacts, or travel memories.</p>
                        </div>
                    )}
                </div>
            </div>
            <style>{`
                .btn-icon:hover { background: #E2E8F0 !important; transform: scale(1.05); transition: all 0.2s; }
            `}</style>
        </Layout>
    );
};

export default TripNotes;
