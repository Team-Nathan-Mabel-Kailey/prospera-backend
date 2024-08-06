const jwt = require('jsonwebtoken'); // Import the jsonwebtoken package

// Middleware function to authenticate users using JWT
const authMiddleware = (req, res, next) => {
    // Extract token from the Authorization header
    const token = req.header('Authorization')?.replace('Bearer ', '');

    // If no token is provided, respond with a 401 Unauthorized status
    if (!token) {
        return res.status(401).json({ error: 'No token provided. Authentication required.' });
    }

    try {
        // Verify the token using the secret key from environment variables
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Attach the decoded user information to the request object
        req.user = decoded;
        // Call the next middleware or route handler
        next();
    } catch (error) {
        // If token verification fails, respond with a 401 Unauthorized status
        res.status(401).json({ error: 'Invalid token. Authentication failed.' });
    }
};

module.exports = authMiddleware; // Export the middleware function
