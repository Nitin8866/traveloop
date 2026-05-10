import AdminLayout from '../components/layout/AdminLayout';
import AdminOverview from '../components/admin/OverviewTab';
import ManageUsers from '../components/admin/ManageUsersTab';
import TrendsAnalysis from '../components/admin/TrendsTab';
import PopularCities from '../components/admin/PopularCitiesTab';
import PopularActivities from '../components/admin/PopularActivitiesTab';

const AdminPanel = ({ tab = 'overview' }) => {
    return (
        <AdminLayout>
            <div className="animate-fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                    <div>
                        <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
                            {tab === 'overview' && 'System Overview'}
                            {tab === 'users' && 'User Management'}
                            {tab === 'trends' && 'Growth & Analytics'}
                            {tab === 'cities' && 'Popular Destinations'}
                            {tab === 'activities' && 'Activity Insights'}
                        </h1>
                        <p style={{ color: '#64748B', fontSize: '0.95rem' }}>Traveloop Admin Control Center</p>
                    </div>
                </div>

                <div className="admin-content-area">
                    {tab === 'overview' && <AdminOverview />}
                    {tab === 'users' && <ManageUsers />}
                    {tab === 'trends' && <TrendsAnalysis />}
                    {tab === 'cities' && <PopularCities />}
                    {tab === 'activities' && <PopularActivities />}
                </div>
            </div>
        </AdminLayout>
    );
};

export default AdminPanel;
