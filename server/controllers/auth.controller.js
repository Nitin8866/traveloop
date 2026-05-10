import db from '../config/db.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const signup = async (req, res) => {
    const { firstName, lastName, email, password, city, country } = req.body;
    try {
        const [existing] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (existing.length > 0) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 12);
        const [result] = await db.execute(
            'INSERT INTO users (first_name, last_name, email, password, city, country) VALUES (?, ?, ?, ?, ?, ?)',
            [firstName, lastName, email, hashedPassword, city, country]
        );

        const token = jwt.sign({ id: result.insertId }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(201).json({ token, user: { id: result.insertId, firstName, lastName, email } });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const [users] = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: 'User not found' });

        const user = users[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.status(200).json({ token, user: { id: user.id, firstName: user.first_name, lastName: user.last_name, email: user.email } });
    } catch (error) {
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};
