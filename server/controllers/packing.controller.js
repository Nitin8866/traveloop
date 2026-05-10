import db from '../config/db.js';

export const getPackingItems = async (req, res) => {
    const { tripId } = req.params;
    try {
        const [items] = await db.execute('SELECT * FROM packing_items WHERE trip_id = ?', [tripId]);
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching packing items' });
    }
};

export const addPackingItem = async (req, res) => {
    const { tripId, itemName, category } = req.body;
    try {
        const [result] = await db.execute(
            'INSERT INTO packing_items (trip_id, item_name, category) VALUES (?, ?, ?)',
            [tripId, itemName, category || 'General']
        );
        res.status(201).json({ id: result.insertId, itemName, category });
    } catch (error) {
        res.status(500).json({ message: 'Error adding packing item' });
    }
};

export const togglePacked = async (req, res) => {
    const { id } = req.params;
    const { isPacked } = req.body;
    try {
        await db.execute('UPDATE packing_items SET is_packed = ? WHERE id = ?', [isPacked, id]);
        res.status(200).json({ message: 'Item updated' });
    } catch (error) {
        res.status(500).json({ message: 'Error updating item' });
    }
};

export const deletePackingItem = async (req, res) => {
    const { id } = req.params;
    try {
        await db.execute('DELETE FROM packing_items WHERE id = ?', [id]);
        res.status(200).json({ message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting item' });
    }
};
