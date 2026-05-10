USE traveloop;

-- Password is 'password123' hashed with bcrypt
SET @pwd = '$2a$12$LJ3a5mV5bQ7V5Z5Z5Z5Z5e5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5Z5';

INSERT INTO users (first_name,last_name,email,password,phone,city,country,bio,created_at) VALUES
('Aarav','Sharma','aarav@gmail.com',@pwd,'9876543210','Mumbai','India','Love exploring new places','2025-01-15'),
('Priya','Patel','priya@gmail.com',@pwd,'9876543211','Ahmedabad','India','Adventure seeker','2025-02-10'),
('Rahul','Verma','rahul@gmail.com',@pwd,'9876543212','Delhi','India','Travel blogger','2025-03-05'),
('Sara','Khan','sara@gmail.com',@pwd,'9876543213','Bangalore','India','Nature lover','2025-03-20'),
('Nitin','Joshi','nitin@gmail.com',@pwd,'9876543214','Pune','India','Solo traveler','2025-04-01'),
('Emma','Wilson','emma@gmail.com',@pwd,'4155551234','New York','USA','Foodie traveler','2025-04-15'),
('James','Brown','james@gmail.com',@pwd,'4155551235','London','UK','History buff','2025-05-01'),
('Yuki','Tanaka','yuki@gmail.com',@pwd,'8155551236','Tokyo','Japan','Culture explorer','2025-05-20'),
('Carlos','Garcia','carlos@gmail.com',@pwd,'3455551237','Barcelona','Spain','Beach lover','2025-06-10'),
('Mei','Chen','mei@gmail.com',@pwd,'8655551238','Singapore','Singapore','City explorer','2025-07-01'),
('Arjun','Reddy','arjun@gmail.com',@pwd,'9876543215','Hyderabad','India','Mountain trekker','2025-07-15'),
('Ananya','Iyer','ananya@gmail.com',@pwd,'9876543216','Chennai','India','Heritage traveler','2025-08-01'),
('Liam','Johnson','liam@gmail.com',@pwd,'2125551239','Chicago','USA','Road trip fan','2025-08-20'),
('Sophie','Martin','sophie@gmail.com',@pwd,'3315551240','Paris','France','Art enthusiast','2025-09-05'),
('Ravi','Kumar','ravi@gmail.com',@pwd,'9876543217','Jaipur','India','Desert explorer','2025-10-01'),
('Aisha','Mohammed','aisha@gmail.com',@pwd,'9715551241','Dubai','UAE','Luxury traveler','2025-10-20'),
('Tom','Anderson','tom@gmail.com',@pwd,'6135551242','Sydney','Australia','Surfer','2025-11-05'),
('Deepa','Nair','deepa@gmail.com',@pwd,'9876543218','Kochi','India','Backpacker','2025-11-25'),
('Alex','Kim','alex@gmail.com',@pwd,'8215551243','Seoul','South Korea','Tech nomad','2025-12-10'),
('Pooja','Singh','pooja@gmail.com',@pwd,'9876543219','Lucknow','India','Food explorer','2026-01-05'),
('Marco','Rossi','marco@gmail.com',@pwd,'3915551244','Rome','Italy','History lover','2026-01-20'),
('Sneha','Desai','sneha@gmail.com',@pwd,'9876543220','Surat','India','Weekend traveler','2026-02-10'),
('David','Lee','david@gmail.com',@pwd,'8525551245','Hong Kong','China','Business traveler','2026-02-28'),
('Kavita','Gupta','kavita@gmail.com',@pwd,'9876543221','Kolkata','India','Cultural explorer','2026-03-15'),
('Noah','Smith','noah@gmail.com',@pwd,'6045551246','Vancouver','Canada','Nature photographer','2026-04-01');
