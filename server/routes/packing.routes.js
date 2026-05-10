import express from 'express';
import { getPackingItems, addPackingItem, togglePacked, deletePackingItem } from '../controllers/packing.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:tripId', auth, getPackingItems);
router.post('/', auth, addPackingItem);
router.patch('/:id', auth, togglePacked);
router.delete('/:id', auth, deletePackingItem);

export default router;
