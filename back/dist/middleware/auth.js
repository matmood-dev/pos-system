import jwt from 'jsonwebtoken';
// Verify JWT token
export const authenticateToken = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN
        if (!token) {
            res.status(401).json({
                success: false,
                message: 'Access token required'
            });
            return;
        }
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
        req.user = decoded;
        next();
    }
    catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                success: false,
                message: 'Token expired'
            });
            return;
        }
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: 'Authentication error'
        });
    }
};
// Check if user has admin role
export const requireAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Admin access required'
        });
    }
};
// Check if user has admin role or is accessing their own resource
export const requireAdminOrSelf = (req, res, next) => {
    const userid = req.params.userid ? parseInt(req.params.userid, 10) : null;
    if (req.user && (req.user.role === 'admin' || (userid !== null && req.user.userid === userid))) {
        next();
    }
    else {
        res.status(403).json({
            success: false,
            message: 'Access denied'
        });
    }
};
// Optional authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const token = authHeader && authHeader.split(' ')[1];
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret');
            req.user = decoded;
        }
        next();
    }
    catch (error) {
        // For optional auth, we don't throw errors, just continue without user
        next();
    }
};
//# sourceMappingURL=auth.js.map