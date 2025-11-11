import jwt from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { query } from '../config/database.js';
import { JWTPayload, ApiResponse } from '../types/index.js';

// Extend Express Request interface
declare global {
  namespace Express {
    interface Request {
      user?: JWTPayload;
    }
  }
}

// Verify JWT token
export const authenticateToken = async (req: Request, res: Response<ApiResponse>, next: NextFunction): Promise<void> => {
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

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JWTPayload;
    req.user = decoded;

    next();
  } catch (error) {
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
export const requireAdmin = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Admin access required'
    });
  }
};

// Check if user has admin role or is accessing their own resource
export const requireAdminOrSelf = (req: Request, res: Response<ApiResponse>, next: NextFunction): void => {
  const userid = req.params.userid ? parseInt(req.params.userid, 10) : null;
  if (req.user && (req.user.role === 'admin' || (userid !== null && req.user.userid === userid))) {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Access denied'
    });
  }
};

// Optional authentication (for endpoints that work with or without auth)
export const optionalAuth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as JWTPayload;
      req.user = decoded;
    }

    next();
  } catch (error) {
    // For optional auth, we don't throw errors, just continue without user
    next();
  }
};