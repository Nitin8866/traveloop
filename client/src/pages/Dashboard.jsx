import React from 'react';
import { Plus, MapPin, Calendar, TrendingUp, Search } from 'lucide-react';

const Dashboard = () => {
  const recentTrips = [
    { id: 1, name: 'Paris & Rome Adventure', dates: 'Aug 10 - Aug 25', stops: 2, status: 'Upcoming', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&q=80&w=400' },
    { id: 2, name: 'Tokyo City Exploration', dates: 'May 02 - May 12', stops: 1, status: 'Ongoing', image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&q=80&w=400' }
  ];

  return (
    <div className="dashboard-container">
      {/* Navigation */}
      <nav className="glass-nav" style={{ padding: '1rem 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '1.8rem', color: 'var(--primary)', margin: 0 }}>Traveloop</h2>
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div className="search-bar" style={{ position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input type="text" placeholder="Search destinations..." style={{ padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: '50px', border: '1px solid #ddd', width: '250px' }} />
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Plus size={20} /> Plan New Trip
          </button>
          <div className="profile-circle" style={{ width: '40px', height: '40px', background: '#ddd', borderRadius: '50%' }}></div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section className="hero-banner" style={{ margin: '2rem 5%', height: '350px', borderRadius: 'var(--radius)', overflow: 'hidden', position: 'relative', background: 'url("https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?auto=format&fit=crop&q=80&w=1200") center/cover' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to right, rgba(15, 76, 92, 0.8), transparent)' }}></div>
        <div style={{ position: 'absolute', left: '4rem', bottom: '4rem', color: 'white', maxWidth: '500px' }}>
          <h1 style={{ color: 'white', fontSize: '3rem', marginBottom: '1rem' }}>Where to next, Nitin?</h1>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Discover hidden gems and plan your dream multi-city journey with ease.</p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ padding: '0 5% 4rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          
          {/* Left Side: Recent Trips */}
          <section>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Your Recent Trips</h3>
              <a href="#" style={{ color: 'var(--secondary)', fontWeight: 600, textDecoration: 'none' }}>View All</a>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {recentTrips.map(trip => (
                <div key={trip.id} className="premium-card" style={{ display: 'flex', gap: '1.5rem', padding: '1rem' }}>
                  <img src={trip.image} alt={trip.name} style={{ width: '120px', height: '120px', borderRadius: '12px', objectFit: 'cover' }} />
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <h4 style={{ fontSize: '1.2rem', marginBottom: '0.4rem' }}>{trip.name}</h4>
                      <span style={{ padding: '4px 12px', borderRadius: '50px', background: trip.status === 'Ongoing' ? '#e1f5fe' : '#fff3e0', color: trip.status === 'Ongoing' ? '#0288d1' : '#f57c00', fontSize: '0.8rem', fontWeight: 600 }}>{trip.status}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><Calendar size={14} /> {trip.dates}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}><MapPin size={14} /> {trip.stops} Stops</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Right Side: Popular Destinations */}
          <aside>
             <div className="premium-card" style={{ background: 'var(--primary)', color: 'white' }}>
               <h3 style={{ color: 'white', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
                 <TrendingUp size={24} /> Popular Cities
               </h3>
               <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  {['Santorini, Greece', 'Kyoto, Japan', 'Bali, Indonesia'].map((city, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '0.8rem', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                      <span>{city}</span>
                      <span style={{ color: 'var(--accent)' }}>★ 4.9</span>
                    </div>
                  ))}
               </div>
               <button className="btn-primary" style={{ background: 'white', color: 'var(--primary)', width: '100%', marginTop: '1.5rem', boxShadow: 'none' }}>Explore More</button>
             </div>

             <div className="premium-card" style={{ marginTop: '2rem', textAlign: 'center' }}>
               <h4 style={{ marginBottom: '0.5rem' }}>Trip Budget Highlight</h4>
               <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>You've saved 15% on your last trip by planning ahead!</p>
               <div style={{ width: '100%', height: '8px', background: '#eee', borderRadius: '10px', position: 'relative' }}>
                  <div style={{ width: '75%', height: '100%', background: 'var(--secondary)', borderRadius: '10px' }}></div>
               </div>
             </div>
          </aside>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
