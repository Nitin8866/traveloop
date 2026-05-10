import jwt from 'jsonwebtoken';

const adminAuth = (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            return res.status(401).json({ message: 'Admin authentication failed: No token provided' });
        }

        const decodedData = jwt.verify(token, process.env.JWT_SECRET);
        
        if (decodedData.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admin privileges required' });
        }

        req.admin = { id: decodedData.id, role: decodedData.role };
        next();
    } catch (error) {
        res.status(401).json({ message: 'Admin authentication failed: Invalid or expired token' });
    }
};

export default adminAuth;
