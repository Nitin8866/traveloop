import express from 'express';
import { getTripNotes, addTripNote, deleteTripNote } from '../controllers/notes.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:tripId', auth, getTripNotes);
router.post('/', auth, addTripNote);
router.delete('/:id', auth, deleteTripNote);

export default router;
