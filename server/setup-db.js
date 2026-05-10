import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';

const setup = async () => {
    // Using your credentials from .env
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'Nitin8866$',
        database: 'traveloop'
    });

    try {
        console.log('--- Traveloop Database Setup ---');

        // 1. Add role column if not exists
        try {
            await connection.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
            console.log('✅ Added "role" column to users table.');
        } catch (err) {
            console.log('ℹ️ "role" column already exists.');
        }

        // 2. Clear existing test users to avoid conflicts
        await connection.execute("DELETE FROM users WHERE email IN ('admin@traveloop.com', 'user@traveloop.com')");

        // 3. Create Admin
        const adminPass = await bcrypt.hash('admin123', 10);
        await connection.execute(
            "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
            ['Admin', 'User', 'admin@traveloop.com', adminPass, 'admin']
        );
        console.log('✅ Created Admin Account: admin@traveloop.com / admin123');

        // 4. Create Regular User
        const userPass = await bcrypt.hash('user123', 10);
        await connection.execute(
            "INSERT INTO users (first_name, last_name, email, password, role) VALUES (?, ?, ?, ?, ?)",
            ['John', 'Doe', 'user@traveloop.com', userPass, 'user']
        );
        console.log('✅ Created User Account: user@traveloop.com / user123');

        console.log('\n--- Setup Complete! You can now log in. ---');
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
        process.exit(1);
    }
};

setup();
