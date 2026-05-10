import express from 'express';
import { getDashboardStats, getAllUsers, getPopularCities, getPopularActivities, deleteUser } from '../controllers/admin.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

// Admin role check middleware
const adminCheck = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied. Admin only.' });
    }
    next();
};

router.get('/stats', auth, adminCheck, getDashboardStats);
router.get('/users', auth, adminCheck, getAllUsers);
router.get('/popular-cities', auth, adminCheck, getPopularCities);
router.get('/popular-activities', auth, adminCheck, getPopularActivities);
router.delete('/users/:id', auth, adminCheck, deleteUser);

export default router;
