import db from '../config/db.js';

export const createTrip = async (req, res) => {
    const { name, startDate, endDate, destinationPlace } = req.body;
    
    // Safety: Handle optional fields with defaults to avoid DB errors
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
        console.error('DATABASE ERROR:', error); // Log to server console for debugging
        res.status(500).json({ message: 'Error creating trip', error: error.message });
    }
};

export const getMyTrips = async (req, res) => {
    const userId = req.user.id;
    try {
        const [trips] = await db.execute('SELECT * FROM trips WHERE user_id = ? ORDER BY start_date DESC', [userId]);
        res.status(200).json(trips);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching trips', error: error.message });
    }
};

export const deleteTrip = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM trips WHERE id = ?', [id]);
        res.status(200).json({ message: 'Trip deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting trip' });
    }
};
