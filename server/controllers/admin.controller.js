import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

export const getDashboardStats = async (req, res) => {
    try {
        const [userCount] = await db.execute('SELECT COUNT(*) as count FROM users');
        const [tripCount] = await db.execute('SELECT COUNT(*) as count FROM trips');
        const [stopCount] = await db.execute('SELECT COUNT(*) as count FROM stops');
        const [expenseSum] = await db.execute('SELECT COALESCE(SUM(amount), 0) as total FROM expenses');
        const [activityCount] = await db.execute('SELECT COUNT(*) as count FROM activities');
        
        // Recent growth (last 30 days)
        const [recentUsers] = await db.execute('SELECT COUNT(*) as count FROM users WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
        const [recentTrips] = await db.execute('SELECT COUNT(*) as count FROM trips WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)');
        
        // Detailed recent users for list
        const [latestUsers] = await db.execute('SELECT first_name, last_name, email, city, country, created_at FROM users ORDER BY created_at DESC LIMIT 5');

        const totalUsers = userCount[0].count;
        const totalTrips = tripCount[0].count;

        res.json({
            totalUsers,
            totalTrips,
            totalStops: stopCount[0].count,
            totalExpenses: expenseSum[0].total,
            totalActivities: activityCount[0].count,
            recentSignups: recentUsers[0].count,
            recentTrips: recentTrips[0].count,
            avgTripsPerUser: totalUsers > 0 ? (totalTrips / totalUsers).toFixed(1) : 0,
            avgExpensePerTrip: totalTrips > 0 ? (expenseSum[0].total / totalTrips).toFixed(0) : 0,
            recentUsers: latestUsers
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stats', error: error.message });
    }
};

export const getUserById = async (req, res) => {
    const { id } = req.params;
    try {
        const [user] = await db.execute('SELECT * FROM users WHERE id = ?', [id]);
        if (!user.length) return res.status(404).json({ message: 'User not found' });

        const [trips] = await db.execute(`
            SELECT t.*, 
                   (SELECT COUNT(*) FROM stops WHERE trip_id = t.id) as stopCount,
                   (SELECT COUNT(*) FROM activities a JOIN stops s ON a.stop_id = s.id WHERE s.trip_id = t.id) as activityCount,
                   (SELECT COALESCE(SUM(amount), 0) FROM expenses WHERE trip_id = t.id) as totalExpense
            FROM trips t WHERE t.user_id = ?
        `, [id]);

        // Get stops for each trip
        for (let trip of trips) {
            const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ?', [trip.id]);
            for (let stop of stops) {
                const [activities] = await db.execute('SELECT * FROM activities WHERE stop_id = ?', [stop.id]);
                stop.activities = activities;
            }
            trip.stops = stops;
        }

        const [summary] = await db.execute(`
            SELECT COUNT(DISTINCT t.id) as totalTrips,
                   COUNT(DISTINCT s.id) as totalStops,
                   COUNT(DISTINCT a.id) as totalActivities,
                   COALESCE(SUM(e.amount), 0) as totalExpense
            FROM users u
            LEFT JOIN trips t ON u.id = t.user_id
            LEFT JOIN stops s ON t.id = s.trip_id
            LEFT JOIN activities a ON s.id = a.stop_id
            LEFT JOIN expenses e ON t.id = e.trip_id
            WHERE u.id = ?
        `, [id]);

        res.json({
            user: user[0],
            trips,
            summary: summary[0]
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching user details', error: error.message });
    }
};

export const getAllUsers = async (req, res) => {
    try {
        const { search, sort, page = 1, limit = 15, groupBy } = req.query;
        const offset = (page - 1) * limit;

        let whereClause = "WHERE role != 'admin'";
        if (search) {
            whereClause += ` AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%' OR city LIKE '%${search}%')`;
        }

        let orderBy = "u.created_at DESC";
        if (sort === 'name_asc') orderBy = "u.first_name ASC";
        if (sort === 'name_desc') orderBy = "u.first_name DESC";
        if (sort === 'most_trips') orderBy = "trip_count DESC";

        const [users] = await db.execute(`
            SELECT u.id, u.first_name, u.last_name, u.email, u.city, u.country, u.role, u.created_at,
                   COUNT(DISTINCT t.id) as trip_count,
                   COUNT(DISTINCT a.id) as activity_count,
                   COALESCE(SUM(e.amount), 0) as total_spent
            FROM users u
            LEFT JOIN trips t ON u.id = t.user_id
            LEFT JOIN stops s ON t.id = s.trip_id
            LEFT JOIN activities a ON s.id = a.stop_id
            LEFT JOIN expenses e ON t.id = e.trip_id
            ${whereClause}
            GROUP BY u.id
            ORDER BY ${orderBy}
            LIMIT ${parseInt(limit)} OFFSET ${offset}
        `);

        const [totalRes] = await db.execute(`SELECT COUNT(*) as count FROM users WHERE role != 'admin' ${search ? `AND (first_name LIKE '%${search}%' OR last_name LIKE '%${search}%' OR email LIKE '%${search}%')` : ''}`);
        const total = totalRes[0].count;

        let groups = [];
        if (groupBy) {
            const [groupRes] = await db.execute(`SELECT ${groupBy}, COUNT(*) as count FROM users WHERE role != 'admin' GROUP BY ${groupBy} ORDER BY count DESC LIMIT 10`);
            groups = groupRes;
        }

        res.json({
            users,
            pagination: {
                total,
                page: parseInt(page),
                totalPages: Math.ceil(total / limit)
            },
            groups
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

export const getPopularCities = async (req, res) => {
    try {
        const { country } = req.query;
        let whereClause = "";
        if (country) {
            whereClause = `WHERE s.country = '${country}'`;
        }

        const [cities] = await db.execute(`
            SELECT s.city_name, s.country, 
                   COUNT(*) as visit_count,
                   COUNT(DISTINCT t.user_id) as unique_visitors
            FROM stops s
            JOIN trips t ON s.trip_id = t.id
            ${whereClause}
            GROUP BY s.city_name, s.country
            ORDER BY visit_count DESC
            LIMIT 15
        `);

        const [allCountries] = await db.execute('SELECT DISTINCT country FROM stops WHERE country IS NOT NULL');
        
        const totalVisits = cities.reduce((sum, c) => sum + c.visit_count, 0);
        cities.forEach(c => {
            c.percentage = totalVisits > 0 ? Math.round((c.visit_count / totalVisits) * 100) : 0;
        });

        res.json({
            cities,
            countries: allCountries.map(c => c.country),
            totalVisits
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular cities', error: error.message });
    }
};

export const getPopularActivities = async (req, res) => {
    try {
        // 1. Total Activity Count
        const [totalRes] = await db.execute('SELECT COUNT(*) as count FROM activities');
        const totalActivities = totalRes[0].count;

        // 2. Type Distribution
        const [typeDistribution] = await db.execute(`
            SELECT type, COUNT(*) as count, 
                   ROUND(AVG(cost), 2) as avg_cost
            FROM activities
            WHERE type IS NOT NULL
            GROUP BY type
            ORDER BY count DESC
        `);
        
        typeDistribution.forEach(t => {
            t.percentage = totalActivities > 0 ? Math.round((t.count / totalActivities) * 100) : 0;
        });

        // 3. Cost Stats
        const [costStats] = await db.execute(`
            SELECT ROUND(AVG(cost), 2) as avgCost, COALESCE(SUM(cost), 0) as totalCost
            FROM activities
        `);

        // 4. Top Individual Activities (by type)
        const [topActivities] = await db.execute(`
            SELECT type as name, type, COUNT(*) as frequency, ROUND(AVG(cost), 2) as avg_cost
            FROM activities
            WHERE type IS NOT NULL
            GROUP BY type
            ORDER BY frequency DESC
            LIMIT 10
        `);

        res.json({
            totalActivities,
            typeDistribution,
            costStats: costStats[0] || { avgCost: 0, totalCost: 0 },
            topActivities
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching popular activities', error: error.message });
    }
};

export const adminLogin = async (req, res) => {
    const { username, password } = req.body;
    
    const envUser = process.env.ADMIN_USERNAME || 'admin@gmail.com';
    const envPass = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === envUser && password === envPass) {
        const token = jwt.sign(
            { id: 999, role: 'admin', username: envUser },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
        
        return res.json({
            token,
            admin: { id: 999, username: envUser, role: 'admin' }
        });
    }

    res.status(401).json({ message: 'Invalid admin credentials' });
};

export const getTrends = async (req, res) => {
    try {
        // 1. Monthly Trip Growth (last 12 months)
        const [tripTrend] = await db.execute(`
            SELECT DATE_FORMAT(created_at, '%b %Y') as label, COUNT(*) as count
            FROM trips
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY label
            ORDER BY MIN(created_at)
        `);

        // 2. Monthly User Signup Growth (last 12 months)
        const [userTrend] = await db.execute(`
            SELECT DATE_FORMAT(created_at, '%b %Y') as label, COUNT(*) as count
            FROM users
            WHERE created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY label
            ORDER BY MIN(created_at)
        `);

        // 3. Top Spenders Leaderboard
        const [topSpenders] = await db.execute(`
            SELECT u.first_name, u.last_name, COUNT(DISTINCT t.id) as trip_count, COALESCE(SUM(e.amount), 0) as total_spent
            FROM users u
            JOIN trips t ON u.id = t.user_id
            JOIN expenses e ON t.id = e.trip_id
            GROUP BY u.id
            ORDER BY total_spent DESC
            LIMIT 5
        `);

        // 4. Trip Duration Analytics
        const [durationStats] = await db.execute(`
            SELECT 
                ROUND(AVG(DATEDIFF(end_date, start_date)), 1) as avgDuration,
                MIN(DATEDIFF(end_date, start_date)) as minDuration,
                MAX(DATEDIFF(end_date, start_date)) as maxDuration
            FROM trips
            WHERE start_date IS NOT NULL AND end_date IS NOT NULL
        `);

        res.json({
            tripCreationTrend: tripTrend,
            userSignupTrend: userTrend,
            topSpenders,
            durationStats: durationStats[0] || { avgDuration: 0, minDuration: 0, maxDuration: 0 }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trends', error: error.message });
    }
};

export const getExpenseAnalytics = async (req, res) => {
    try {
        // 1. Category Breakdown
        const [categoryBreakdown] = await db.execute(`
            SELECT category, SUM(amount) as total, COUNT(*) as entries, ROUND(AVG(amount), 2) as average
            FROM expenses
            GROUP BY category
            ORDER BY total DESC
        `);

        // 2. Monthly Expense Trend
        const [monthlyTrend] = await db.execute(`
            SELECT DATE_FORMAT(t.created_at, '%b %Y') as label, SUM(e.amount) as total
            FROM expenses e
            JOIN trips t ON e.trip_id = t.id
            WHERE t.created_at >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY label
            ORDER BY MIN(t.created_at)
        `);

        // 3. Overall Stats
        const [overall] = await db.execute(`
            SELECT 
                COALESCE(SUM(amount), 0) as totalSpending,
                COUNT(*) as totalEntries,
                COUNT(DISTINCT trip_id) as tripsWithExpenses
            FROM expenses
        `);

        // 4. Top Trips by Expense
        const [topTrips] = await db.execute(`
            SELECT t.name as trip_name, u.first_name, u.last_name, COUNT(e.id) as expense_count, SUM(e.amount) as total_expense
            FROM trips t
            JOIN users u ON t.user_id = u.id
            JOIN expenses e ON t.id = e.trip_id
            GROUP BY t.id
            ORDER BY total_expense DESC
            LIMIT 5
        `);

        res.json({
            categoryBreakdown,
            monthlyTrend,
            overallStats: overall[0],
            topTrips
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expense analytics', error: error.message });
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
