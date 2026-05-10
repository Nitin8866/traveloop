import express from 'express';
import { addStop, getStopsByTrip, addActivity, getActivitiesByStop } from '../controllers/itinerary.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/stops', auth, addStop);
router.get('/stops/:tripId', auth, getStopsByTrip);
router.post('/activities', auth, addActivity);
router.get('/activities/:stopId', auth, getActivitiesByStop);

export default router;
