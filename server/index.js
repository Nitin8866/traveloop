import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import db from './config/db.js';

import authRoutes from './routes/auth.routes.js';
import tripRoutes from './routes/trip.routes.js';
import itineraryRoutes from './routes/itinerary.routes.js';
import googleRoutes from './routes/google.routes.js';
import utilityRoutes from './routes/utility.routes.js';
import adminRoutes from './routes/admin.routes.js';
import notesRoutes from './routes/notes.routes.js';
import packingRoutes from './routes/packing.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/itinerary', itineraryRoutes);
app.use('/api/utility', utilityRoutes);
app.use('/api/google', googleRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notes', notesRoutes);
app.use('/api/packing', packingRoutes);

// Basic Route
app.get('/', (req, res) => {
    res.send('Traveloop API is running...');
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
