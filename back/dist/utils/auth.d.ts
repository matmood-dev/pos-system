import { User } from '../types/index.js';
export declare const hashPassword: (password: string) => Promise<string>;
export declare const verifyPassword: (password: string, hashedPassword: string) => Promise<boolean>;
export declare const generateToken: (user: User) => string;
export declare const generateRefreshToken: (user: User) => string;
export declare const authenticateUser: (username: string, password: string) => Promise<User | null>;
export declare const createDefaultAdmin: () => Promise<void>;
//# sourceMappingURL=auth.d.ts.map