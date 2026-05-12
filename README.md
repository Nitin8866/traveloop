# 🌍 Traveloop: The Ultimate Multi-Destination Journey Planner

Traveloop is a premium, full-stack travel planning platform designed to simplify the complexities of multi-destination trip management. Whether you're planning a weekend getaway or a cross-country expedition, Traveloop provides the tools to build, manage, and optimize your itineraries with ease.

---

## 🚀 Key Features

- **📍 Intelligent Multi-City Routing**: Build complex itineraries with multiple stops and optimized sequencing.
- **✨ AI-Powered Recommendations**: Discover nearby attractions and "must-visit" spots based on your destination coordinates (powered by Google Maps API).
- **🎒 Smart Packing Assistant**: Never forget an essential again with our trip-specific packing list manager.
- **💰 Budget Estimation**: Track your projected expenses per destination in real-time.
- **🔒 Secure Authentication**: Robust user authentication system powered by JWT to keep your travel plans private.
- **📱 Premium Responsive Design**: A high-fidelity, interactive UI built with modern glassmorphic aesthetics and smooth animations.

---

## 🛠 Tech Stack

- **Frontend**: React.js (Vite), React Router, Axios, Lucide React
- **Backend**: Node.js, Express.js
- **Database**: MySQL (Optimized Schema)
- **Authentication**: JSON Web Tokens (JWT) & BcryptJS
- **APIs**: Google Maps Places API, Komoot Photon (Geocoding)

---

## ⚙️ Project Configuration

### Prerequisites
- [Node.js](https://nodejs.org/) (v16+)
- [MySQL](https://www.mysql.com/) (v8.0+)
- Google Maps API Key (with Places API enabled)

### Database Setup
1. Open your MySQL client (e.g., MySQL Workbench or terminal).
2. Create a new database named `traveloop`.
3. You can either import the SQL file manually:
   ```bash
   mysql -u your_username -p traveloop < traveloop_full_data.sql
   ```
4. **OR** use our automated setup script (Recommended):
   ```bash
   cd server
   npm run setup
   ```
   *This script will configure tables, migrations, and create default admin/user accounts.*

### Environment Variables
Create a `.env` file in the `server/` directory and add the following:

```env
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=traveloop
JWT_SECRET=your_super_secret_key
PORT=5001

# Admin Credentials (Optional)
ADMIN_USERNAME=admin@traveloop.com
ADMIN_PASSWORD=secure_admin_pass

# APIs
GOOGLE_MAPS_API_KEY=your_google_maps_key
```

---

## 🏃‍♂️ How to Run

### 1. Start the Backend Server
```bash
cd server
npm install
npm run dev
```
*The server will start on `http://localhost:5001`*

### 2. Start the Frontend Client
```bash
cd client
npm install
npm run dev
```
*The application will be available at `http://localhost:5173`*

---

## 📂 Project Structure

```text
traveloop/
├── client/              # React Frontend (Vite)
│   ├── src/
│   │   ├── components/  # Reusable UI Components
│   │   ├── pages/       # Core views (Itinerary, Trips, etc.)
│   │   └── assets/      # Styles and Images
├── server/              # Node.js Backend
│   ├── config/          # DB connection & setup
│   ├── controllers/     # Business logic
│   ├── routes/          # API Endpoints
│   └── middleware/      # Auth & Error handling
├── traveloop_full_data.sql # Database export
└── README.md
```

---

## 🏆 Hackathon Winning Edge

Traveloop stands out by solving the "Planning Paralysis" often associated with multi-city travel. By integrating real-time attraction data with a centralized itinerary builder and utility tools like packing lists, it provides a 360-degree planning experience that most basic travel apps lack.

---

## 👥 Contributors
- **Nitin Maharaj** ([@Nitin8866](https://github.com/Nitin8866))
- **Prit Patel** ([@Patelprit09](https://github.com/Patelprit09))
- **Priyanshi** ([@Priyanshi092004](https://github.com/Priyanshi092004))
- **Shreyalsinh Raj** ([@Shreyal216](https://github.com/Shreyal216))

---
Developed for Odoo Hackathon 🚀
