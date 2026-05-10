-- Traveloop Database Indexes for Performance
USE traveloop;

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_city ON users(city);
CREATE INDEX idx_users_country ON users(country);
CREATE INDEX idx_users_created ON users(created_at);

-- Trips indexes
CREATE INDEX idx_trips_user ON trips(user_id);
CREATE INDEX idx_trips_created ON trips(created_at);
CREATE INDEX idx_trips_dates ON trips(start_date, end_date);

-- Stops indexes
CREATE INDEX idx_stops_trip ON stops(trip_id);
CREATE INDEX idx_stops_city ON stops(city_name);
CREATE INDEX idx_stops_country ON stops(country);

-- Activities indexes
CREATE INDEX idx_activities_stop ON activities(stop_id);
CREATE INDEX idx_activities_type ON activities(type);

-- Expenses indexes
CREATE INDEX idx_expenses_trip ON expenses(trip_id);
CREATE INDEX idx_expenses_category ON expenses(category);
CREATE INDEX idx_expenses_date ON expenses(date);

-- Notes indexes
CREATE INDEX idx_notes_trip ON notes(trip_id);

-- Checklists indexes
CREATE INDEX idx_checklists_trip ON checklists(trip_id);
