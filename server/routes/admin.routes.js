import express from 'express';
import { getDashboardStats, getAllUsers, getPopularCities, getPopularActivities, deleteUser, adminLogin, getTrends, getUserById, getExpenseAnalytics } from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Public Admin Route
router.post('/login', adminLogin);

// Admin role check middleware
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

router.get('/stats', auth, adminCheck, getDashboardStats);
router.get('/users', auth, adminCheck, getAllUsers);
router.get('/users/:id', auth, adminCheck, getUserById);
router.get('/popular-cities', auth, adminCheck, getPopularCities);
router.get('/popular-activities', auth, adminCheck, getPopularActivities);
router.get('/trends', auth, adminCheck, getTrends);
router.get('/expense-analytics', auth, adminCheck, getExpenseAnalytics);
router.delete('/users/:id', auth, adminCheck, deleteUser);

export default router;
