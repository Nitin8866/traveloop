import express from 'express';
import { createTrip, getMyTrips, getTripById, updateTrip, deleteTrip, getPublicTrip } from '../controllers/trip.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/public/:id', getPublicTrip);
router.post('/', auth, createTrip);
router.get('/', auth, getMyTrips);
router.get('/:id', auth, getTripById);
router.put('/:id', auth, updateTrip);
router.delete('/:id', auth, deleteTrip);

export default router;
