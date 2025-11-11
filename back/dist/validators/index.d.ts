import { ValidationChain } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import { ApiResponse } from '../types/index.js';
export declare const handleValidationErrors: (req: Request, res: Response<ApiResponse>, next: NextFunction) => void;
export declare const validateUserCreation: ValidationChain[];
export declare const validateUserUpdate: ValidationChain[];
export declare const validateItemCreation: ValidationChain[];
export declare const validateItemUpdate: ValidationChain[];
export declare const validateCustomerCreation: ValidationChain[];
export declare const validateCustomerUpdate: ValidationChain[];
export declare const validateOrderCreation: ValidationChain[];
export declare const validateOrderUpdate: ValidationChain[];
export declare const validateLogin: ValidationChain[];
export declare const validateIdParam: ValidationChain[];
//# sourceMappingURL=index.d.ts.map