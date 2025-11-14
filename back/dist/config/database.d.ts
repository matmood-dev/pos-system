import mysql from 'mysql2/promise';
declare const pool: mysql.Pool;
export declare const connectDB: () => Promise<void>;
export declare const query: (text: string, params?: any[]) => Promise<any>;
export declare const getClient: () => Promise<mysql.PoolConnection>;
export default pool;
//# sourceMappingURL=database.d.ts.map