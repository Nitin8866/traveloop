import db from '../config/db.js';

// --- EXPENSES ---
export const addExpense = async (req, res) => {
    const { tripId, category, description, amount, date } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO expenses (trip_id, category, description, amount, date) VALUES (?, ?, ?, ?, ?)',
            [tripId, category, description, amount, date]
        );
        res.status(201).json({ id: result.insertId, description });
    } catch (error) {
        res.status(500).json({ message: 'Error adding expense' });
    }
};

export const getExpensesByTrip = async (req, res) => {
    const { tripId } = req.params;
    try {
        const [expenses] = await db.execute('SELECT * FROM expenses WHERE trip_id = ? ORDER BY date DESC', [tripId]);
        res.status(200).json(expenses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching expenses' });
    }
};

// --- CHECKLIST ---
export const addChecklistItem = async (req, res) => {
    const { tripId, itemName, category } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO checklists (trip_id, item_name, category) VALUES (?, ?, ?)',
            [tripId, itemName, category]
        );
        res.status(201).json({ id: result.insertId, itemName });
    } catch (error) {
        res.status(500).json({ message: 'Error adding checklist item' });
    }
};

export const toggleChecklistItem = async (req, res) => {
    const { id } = req.params;
    const { isPacked } = req.body;
    try {
        await db.execute('UPDATE checklists SET is_packed = ? WHERE id = ?', [isPacked, id]);
        res.status(200).json({ message: 'Status updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating status' });
    }
};

export const getChecklistByTrip = async (req, res) => {
    const { tripId } = req.params;
    try {
        const [items] = await db.execute('SELECT * FROM checklists WHERE trip_id = ?', [tripId]);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching checklist' });
    }
};
