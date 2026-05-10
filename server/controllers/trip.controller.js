import db from '../config/db.js';

export const getPublicTrip = async (req, res) => {
    const { id } = req.params;
    try {
        const [trips] = await db.execute('SELECT * FROM trips WHERE id = ?', [id]);
        if (trips.length === 0) return res.status(404).json({ message: 'Trip not found' });
        
        const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [id]);
        res.status(200).json({ ...trips[0], stops });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching public trip' });
    }
};

export const createTrip = async (req, res) => {
    const { name, startDate, endDate, destinationPlace } = req.body;
    
    const description = req.body.description || 'My amazing journey';
    const coverPhoto = req.body.coverPhoto || 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&q=80&w=800';
    const sourcePlace = req.body.sourcePlace || '';
    const userId = req.user.id; 

    try {
        const [result] = await db.execute(
            'INSERT INTO trips (user_id, name, description, start_date, end_date, cover_photo, source_place, destination_place) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [userId, name, description, startDate || null, endDate || null, coverPhoto, sourcePlace, destinationPlace || '']
        );
        res.status(201).json({ id: result.insertId, name, description });
    } catch (error) {
        console.error('DATABASE ERROR:', error);
        res.status(500).json({ message: 'Error creating trip', error: error.message });
    }
};

export const getMyTrips = async (req, res) => {
    const userId = req.user.id;
    try {
        const [trips] = await db.execute(`
            SELECT t.*, COUNT(s.id) as stop_count 
            FROM trips t 
            LEFT JOIN stops s ON t.id = s.trip_id 
            WHERE t.user_id = ? 
            GROUP BY t.id 
            ORDER BY t.start_date DESC
        `, [userId]);
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

export const getTripById = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        const [trips] = await db.execute('SELECT * FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
        if (trips.length === 0) return res.status(404).json({ message: 'Trip not found' });
        
        const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [id]);
        const trip = { ...trips[0], stops, stop_count: stops.length };
        res.status(200).json(trip);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trip', error: error.message });
    }
};

export const updateTrip = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    const { name, description, startDate, endDate, coverPhoto } = req.body;
    try {
        await db.execute(
            'UPDATE trips SET name = ?, description = ?, start_date = ?, end_date = ?, cover_photo = ? WHERE id = ? AND user_id = ?',
            [name, description, startDate || null, endDate || null, coverPhoto || null, id, userId]
        );
        res.status(200).json({ message: 'Trip updated successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating trip', error: error.message });
    }
};

export const deleteTrip = async (req, res) => {
    const { id } = req.params;
    const userId = req.user.id;
    try {
        await db.execute('DELETE FROM trips WHERE id = ? AND user_id = ?', [id, userId]);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trip' });
    }
};
