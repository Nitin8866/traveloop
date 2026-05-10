import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const GOOGLE_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

// NEW: Professional Nearby Discovery Engine
router.get('/nearby-attractions', async (req, res) => {
    const { lat, lon } = req.query;
    
    if (!GOOGLE_API_KEY || GOOGLE_API_KEY === 'YOUR_GOOGLE_MAPS_API_KEY_HERE') {
        return res.status(404).json({ message: 'Google API Key not configured' });
    }

    try {
        // Search specifically for high-value tourist categories
        const searchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=40000&type=tourist_attraction&key=${GOOGLE_API_KEY}`);
        
        const results = searchRes.data.results.slice(0, 10).map(place => ({
            name: place.name,
            address: place.vicinity,
            rating: place.rating,
            types: place.types,
            photo: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null,
            location: place.geometry.location
        }));

        res.json(results);
    } catch (err) {
        res.status(500).json({ message: 'Discovery Error', error: err.message });
    }
});

// Single Place Details (Kept for fallback)
router.get('/place-details', async (req, res) => {
    const { name } = req.query;
    try {
        const searchRes = await axios.get(`https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(name)}&inputtype=textquery&fields=photos,rating,types,geometry,formatted_address,name&key=${GOOGLE_API_KEY}`);
        if (searchRes.data.candidates && searchRes.data.candidates.length > 0) {
            const place = searchRes.data.candidates[0];
            res.json({
                name: place.name,
                address: place.formatted_address,
                rating: place.rating,
                photo: place.photos ? `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&photoreference=${place.photos[0].photo_reference}&key=${GOOGLE_API_KEY}` : null
            });
        } else {
            res.status(404).json({ message: 'Not found' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Error', error: err.message });
    }
});

export default router;
