import React from 'react';
import Layout from '../components/layout/Layout';
import { Search, SlidersHorizontal, LayoutGrid, Heart, MessageCircle, Share2, User, Globe } from 'lucide-react';

const Community = () => {
    const posts = [
        { 
            user: 'Sarah Jenkins', 
            time: '2 hours ago', 
            content: 'Just finished my 2-week trip to Japan! Interlaken was definitely the highlight. If you are planning a trip, do not miss the paragliding!', 
            img: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=600',
            likes: 124,
            comments: 18
        },
        { 
            user: 'Marco Rossi', 
            time: '5 hours ago', 
            content: 'The Amalfi Coast is even more beautiful in person. Highly recommend renting a boat for a day to see the hidden coves.', 
            img: 'https://images.unsplash.com/photo-1533104816931-20fa691ff6ca?auto=format&fit=crop&w=600',
            likes: 89,
            comments: 12
        },
        { 
            user: 'Elena Gilbert', 
            time: '1 day ago', 
            content: 'Found this amazing cafe in the heart of Rome. Best espresso I have ever had! #Rome #TravelTips', 
            img: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=600',
            likes: 256,
            comments: 45
        }
    ];

    return (
        <Layout>
            <div className="animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
                <div style={{ marginBottom: '3rem' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Community tab</h1>
                    <p style={{ color: 'var(--text-muted)' }}>Share your experiences and discover tips from fellow travelers.</p>
                </div>

                {/* Search & Filters */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '3rem' }}>
                    <div style={{ flex: 1, position: 'relative' }}>
                        <Search size={18} style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF' }} />
                        <input type="text" placeholder="Search community posts..." style={{ width: '100%', paddingLeft: '48px' }} />
                    </div>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><LayoutGrid size={18} /> Group by</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}><SlidersHorizontal size={18} /> Filter</button>
                    <button style={{ padding: '0 20px', borderRadius: '12px', border: '1px solid #eee', background: 'white', color: '#555', display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>Sort by...</button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
                    {posts.map((post, i) => (
                        <div key={i} className="premium-card animate-fade-in" style={{ padding: '0' }}>
                            <div style={{ padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{ width: '45px', height: '45px', borderRadius: '14px', background: 'var(--primary-gradient)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                                        <User size={20} />
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: 800 }}>{post.user}</p>
                                        <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{post.time} • <Globe size={10} /> Public</p>
                                    </div>
                                </div>
                                <button style={{ background: 'none', border: 'none', color: '#9CA3AF' }}><Share2 size={20} /></button>
                            </div>
                            
                            <img src={post.img} style={{ width: '100%', height: '350px', objectFit: 'cover' }} alt="" />
                            
                            <div style={{ padding: '1.5rem' }}>
                                <p style={{ color: 'var(--text-main)', lineHeight: 1.6, marginBottom: '1.5rem' }}>{post.content}</p>
                                
                                <div style={{ display: 'flex', gap: '2rem', borderTop: '1px solid #f8f9fa', paddingTop: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                                        <Heart size={20} /> {post.likes}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 600, cursor: 'pointer' }}>
                                        <MessageCircle size={20} /> {post.comments}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
};

export default Community;
