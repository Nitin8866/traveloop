import db from '../config/db.js';

export const getTripNotes = async (req, res) => {
    const { tripId } = req.params;
    try {
        const [notes] = await db.execute('SELECT * FROM trip_notes WHERE trip_id = ? ORDER BY created_at DESC', [tripId]);
        res.status(200).json(notes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching notes' });
    }
};

export const addTripNote = async (req, res) => {
    const { tripId, stopId, content } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO trip_notes (trip_id, stop_id, content) VALUES (?, ?, ?)',
            [tripId, stopId || null, content]
        );
        res.status(201).json({ id: result.insertId, content, stopId });
    } catch (error) {
        res.status(500).json({ message: 'Error adding note' });
    }
};

export const deleteTripNote = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM trip_notes WHERE id = ?', [id]);
        res.status(200).json({ message: 'Note deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting note' });
    }
};
