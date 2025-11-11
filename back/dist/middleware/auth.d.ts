import { Request, Response, NextFunction } from 'express';
import { JWTPayload, ApiResponse } from '../types/index.js';
declare global {
    namespace Express {
        interface Request {
            user?: JWTPayload;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response<ApiResponse>, next: NextFunction) => Promise<void>;
export declare const requireAdmin: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const requireAdminOrSelf: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const optionalAuth: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=auth.d.ts.map