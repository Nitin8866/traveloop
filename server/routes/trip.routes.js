import express from 'express';
import { createTrip, getMyTrips, deleteTrip } from '../controllers/trip.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/', auth, createTrip);
router.get('/', auth, getMyTrips);
router.delete('/:id', auth, deleteTrip);

export default router;
