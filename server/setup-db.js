import mysql from 'mysql2/promise';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const setup = async () => {
    const connection = await mysql.createConnection({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'traveloop'
    });

    try {
        console.log('--- Traveloop Database Setup ---\n');

        // 1. Add role column to users if missing
        try {
            await connection.execute("ALTER TABLE users ADD COLUMN role VARCHAR(20) DEFAULT 'user'");
            console.log('✅ Added "role" column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "role" column already exists in users.');
            else throw err;
        }

        // 2. Add phone column to users if missing
        try {
            await connection.execute("ALTER TABLE users ADD COLUMN phone VARCHAR(20) AFTER password");
            console.log('✅ Added "phone" column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "phone" column already exists in users.');
            else throw err;
        }

        // Add bio column to users if missing
        try {
            await connection.execute("ALTER TABLE users ADD COLUMN bio TEXT");
            console.log('✅ Added "bio" column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "bio" column already exists in users.');
            else throw err;
        }

        // Add photo column to users if missing
        try {
            await connection.execute("ALTER TABLE users ADD COLUMN photo VARCHAR(255)");
            console.log('✅ Added "photo" column to users table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "photo" column already exists in users.');
            else throw err;
        }

        // 3. Add source_place to trips if missing
        try {
            await connection.execute("ALTER TABLE trips ADD COLUMN source_place VARCHAR(255) DEFAULT ''");
            console.log('✅ Added "source_place" column to trips table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "source_place" column already exists in trips.');
            else throw err;
        }

        // 4. Add destination_place to trips if missing
        try {
            await connection.execute("ALTER TABLE trips ADD COLUMN destination_place VARCHAR(255) DEFAULT ''");
            console.log('✅ Added "destination_place" column to trips table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "destination_place" column already exists in trips.');
            else throw err;
        }

        // 5. Add budget to trips if missing
        try {
            await connection.execute("ALTER TABLE trips ADD COLUMN budget DECIMAL(12,2) DEFAULT 0.00");
            console.log('✅ Added "budget" column to trips table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "budget" column already exists in trips.');
            else throw err;
        }

        // 6. Add budget to stops if missing
        try {
            await connection.execute("ALTER TABLE stops ADD COLUMN budget DECIMAL(12,2) DEFAULT 0.00");
            console.log('✅ Added "budget" column to stops table.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') console.log('ℹ️  "budget" column already exists in stops.');
            else throw err;
        }

        // 7. Create packing_items table if missing
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS packing_items (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    trip_id INT,
                    item_name VARCHAR(100) NOT NULL,
                    category VARCHAR(50) DEFAULT 'General',
                    is_packed BOOLEAN DEFAULT FALSE,
                    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
                )
            `);
            console.log('✅ Ensured "packing_items" table exists.');
        } catch (err) {
            console.log('ℹ️  packing_items table issue:', err.message);
        }

        // 8. Create trip_notes table if missing
        try {
            await connection.execute(`
                CREATE TABLE IF NOT EXISTS trip_notes (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    trip_id INT,
                    stop_id INT,
                    content TEXT NOT NULL,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
                    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE SET NULL
                )
            `);
            console.log('✅ Ensured "trip_notes" table exists.');
        } catch (err) {
            console.log('ℹ️  trip_notes table issue:', err.message);
        }

        console.log('\n--- User Accounts ---');

        // 9. Create/Reset Admin Account
        await connection.execute("DELETE FROM users WHERE email = 'admin@traveloop.com'");
        const adminPass = await bcrypt.hash('admin123', 10);
        await connection.execute(
            "INSERT INTO users (first_name, last_name, email, password, role, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['Admin', 'User', 'admin@traveloop.com', adminPass, 'admin', 'Mumbai', 'India']
        );
        console.log('✅ Admin Account: admin@traveloop.com / admin123');

        // 10. Create/Reset Regular User Account
        await connection.execute("DELETE FROM users WHERE email = 'user@traveloop.com'");
        const userPass = await bcrypt.hash('user123', 10);
        await connection.execute(
            "INSERT INTO users (first_name, last_name, email, password, role, city, country) VALUES (?, ?, ?, ?, ?, ?, ?)",
            ['John', 'Doe', 'user@traveloop.com', userPass, 'user', 'Delhi', 'India']
        );
        console.log('✅ User Account: user@traveloop.com / user123');

        console.log('\n--- Setup Complete! You can now log in. ---');
        await connection.end();
        process.exit(0);
    } catch (error) {
        console.error('❌ Setup Failed:', error.message);
        await connection.end();
        process.exit(1);
    }
};

setup();
