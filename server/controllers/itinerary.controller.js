import db from '../config/db.js';

// --- STOPS ---
export const addStop = async (req, res) => {
    const { tripId, cityName, country, arrivalDate, departureDate, orderIndex, budget } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO stops (trip_id, city_name, country, arrival_date, departure_date, budget, order_index) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [tripId, cityName, country, arrivalDate, departureDate, budget || 0, orderIndex || 0]
        );
        res.status(201).json({ id: result.insertId, cityName });
    } catch (error) {
        res.status(500).json({ message: 'Error adding stop', error: error.message });
    }
};

export const getStopsByTrip = async (req, res) => {
    const { tripId } = req.params;
    try {
        const [stops] = await db.execute('SELECT * FROM stops WHERE trip_id = ? ORDER BY order_index ASC', [tripId]);
        res.status(200).json(stops);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching stops' });
    }
};

// --- ACTIVITIES ---
export const addActivity = async (req, res) => {
    const { stopId, name, description, type, cost, duration, time } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO activities (stop_id, name, description, type, cost, duration, time) VALUES (?, ?, ?, ?, ?, ?, ?)',
            [stopId, name, description, type, cost, duration, time]
        );
        res.status(201).json({ id: result.insertId, name });
    } catch (error) {
        res.status(500).json({ message: 'Error adding activity' });
    }
};

export const getActivitiesByStop = async (req, res) => {
    const { stopId } = req.params;
    try {
        const [activities] = await db.execute('SELECT * FROM activities WHERE stop_id = ? ORDER BY time ASC', [stopId]);
        res.status(200).json(activities);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching activities' });
    }
};
