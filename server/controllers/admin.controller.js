import db from '../config/db.js';

export const getDashboardStats = async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [tripCount] = await db.execute('SELECT COUNT(*) as count FROM trips');
        const [stopCount] = await db.execute('SELECT COUNT(*) as count FROM stops');
        const [expenseSum] = await db.execute('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');
        
        res.json({
            totalUsers: userCount[0].count,
            totalTrips: tripCount[0].count,
            totalStops: stopCount[0].count,
            totalRevenue: expenseSum[0].total
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const [users] = await db.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, u.city, u.country, u.role, u.created_at,
                   COUNT(t.id) as trip_count
            FROM users u
            LEFT JOIN trips t ON u.id = t.user_id
            GROUP BY u.id
            ORDER BY u.created_at DESC
        `);
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const getPopularCities = async (req, res) => {
    try {
        const [cities] = await db.execute(`
            SELECT city_name, country, COUNT(*) as visit_count
            FROM stops
            GROUP BY city_name, country
            ORDER BY visit_count DESC
            LIMIT 10
        `);
        res.json(cities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular cities', error: error.message });
    }
};

export const getPopularActivities = async (req, res) => {
    try {
        const [activities] = await db.execute(`
            SELECT type, COUNT(*) as count, ROUND(AVG(cost), 2) as avg_cost
            FROM activities
            WHERE type IS NOT NULL
            GROUP BY type
            ORDER BY count DESC
            LIMIT 10
        `);
        res.json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular activities', error: error.message });
    }
};

export const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        // Don't allow deleting yourself
        if (parseInt(id) === req.user.id) {
            return res.status(400).json({ message: 'Cannot delete your own account' });
        }
        await db.execute('DELETE FROM users WHERE id = ?', [id]);
        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};
