-- Traveloop Database Schema (Production-Ready)

CREATE DATABASE IF NOT EXISTS traveloop;
USE traveloop;

-- 1. Users Table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    city VARCHAR(50),
    country VARCHAR(100),
    photo VARCHAR(255),
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Trips Table
CREATE TABLE IF NOT EXISTS trips (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    start_date DATE,
    end_date DATE,
    cover_photo VARCHAR(255),
    source_place VARCHAR(255) DEFAULT '',
    destination_place VARCHAR(255) DEFAULT '',
    budget DECIMAL(12, 2) DEFAULT 0.00,
    is_public BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 3. Stops Table (Multi-city destinations)
CREATE TABLE IF NOT EXISTS stops (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    city_name VARCHAR(100) NOT NULL,
    country VARCHAR(100),
    arrival_date DATE,
    departure_date DATE,
    budget DECIMAL(12, 2) DEFAULT 0.00,
    order_index INT NOT NULL DEFAULT 0,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 4. Activities Table
CREATE TABLE IF NOT EXISTS activities (
    id INT AUTO_INCREMENT PRIMARY KEY,
    stop_id INT,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    type VARCHAR(50),
    cost DECIMAL(10, 2) DEFAULT 0.00,
    duration VARCHAR(50),
    time TIME,
    image_url VARCHAR(255),
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE CASCADE
);

-- 5. Expenses Table
CREATE TABLE IF NOT EXISTS expenses (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    category VARCHAR(50),
    description VARCHAR(255),
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'paid') DEFAULT 'pending',
    date DATE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 6. Packing Items Table
CREATE TABLE IF NOT EXISTS packing_items (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    item_name VARCHAR(100) NOT NULL,
    category VARCHAR(50) DEFAULT 'General',
    is_packed BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE
);

-- 7. Trip Notes Table
CREATE TABLE IF NOT EXISTS trip_notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    trip_id INT,
    stop_id INT,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
    FOREIGN KEY (stop_id) REFERENCES stops(id) ON DELETE SET NULL
);
