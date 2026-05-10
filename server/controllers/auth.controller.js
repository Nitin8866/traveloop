import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, phone, city, country, bio } = req.body;
    try {
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password, phone, city, country, bio) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, phone || null, city || null, country || null, bio || null]
        );

        const token = jwt.sign({ id: result.insertId, role: 'user' }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.insertId, firstName, lastName, email, role: 'user' } });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT id, first_name, last_name, email, password, phone, city, country, bio, photo, role FROM users WHERE email = ?', [email]);
        const user = users[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET || 'traveloop_secret_key_123', { expiresIn: '24h' });
        res.json({ 
            token, 
            user: { 
                id: user.id, 
                firstName: user.first_name, 
                lastName: user.last_name, 
                email: user.email,
                phone: user.phone,
                city: user.city,
                country: user.country,
                bio: user.bio,
                photo: user.photo,
                role: user.role 
            } 
        });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

export const getProfile = async (req, res) => {
    const userId = req.user.id;
    try {
        const [users] = await db.execute(
            'SELECT id, first_name, last_name, email, phone, city, country, bio, photo, role, created_at FROM users WHERE id = ?', 
            [userId]
        );
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });
        
        const user = users[0];
        const [trips] = await db.execute('SELECT id, name, start_date, end_date, cover_photo, destination_place FROM trips WHERE user_id = ? ORDER BY start_date DESC', [userId]);
        
        res.json({
            id: user.id,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            phone: user.phone,
            city: user.city,
            country: user.country,
            bio: user.bio,
            photo: user.photo,
            role: user.role,
            createdAt: user.created_at,
            trips
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching profile', error: error.message });
    }
};

export const updateProfile = async (req, res) => {
    const userId = req.user.id;
    const { firstName, lastName, phone, city, country, bio } = req.body;
    try {
        await db.execute(
            'UPDATE users SET first_name = ?, last_name = ?, phone = ?, city = ?, country = ?, bio = ? WHERE id = ?',
            [firstName, lastName, phone || null, city || null, country || null, bio || null, userId]
        );
        
        // Update localStorage user data by returning fresh data
        const [users] = await db.execute('SELECT id, first_name, last_name, email, phone, city, country, bio, photo, role FROM users WHERE id = ?', [userId]);
        const user = users[0];
        
        res.json({ 
            message: 'Profile updated',
            user: {
                id: user.id,
                firstName: user.first_name,
                lastName: user.last_name,
                email: user.email,
                phone: user.phone,
                city: user.city,
                country: user.country,
                bio: user.bio,
                photo: user.photo,
                role: user.role
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Error updating profile', error: error.message });
    }
};
