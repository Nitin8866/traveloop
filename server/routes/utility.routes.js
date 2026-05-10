import express from 'express';
import { addExpense, getExpensesByTrip, addChecklistItem, toggleChecklistItem, getChecklistByTrip } from '../controllers/utility.controller.js';
import auth from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/expenses', auth, addExpense);
router.get('/expenses/:tripId', auth, getExpensesByTrip);
router.post('/checklist', auth, addChecklistItem);
router.put('/checklist/:id', auth, toggleChecklistItem);
router.get('/checklist/:tripId', auth, getChecklistByTrip);

export default router;
