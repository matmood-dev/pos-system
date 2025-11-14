import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    database: process.env.DB_NAME || 'pos_system',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    waitForConnections: true,
    connectionLimit: 20,
    queueLimit: 0,
    connectTimeout: 60000,
});
// Test database connection
export const connectDB = async () => {
    try {
        const connection = await pool.getConnection();
        console.log('✅ Database connected successfully');
        // Create tables if they don't exist
        await createTables();
        connection.release();
    }
    catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error('❌ Database connection failed:', errorMessage);
        throw error;
    }
};
// Create database tables
const createTables = async () => {
    const connection = await pool.getConnection();
    try {
        // Create users table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS users (
        userid INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        role ENUM('admin', 'cashier') NOT NULL DEFAULT 'cashier',
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        // Create items table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS items (
        itemid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
        category VARCHAR(50) NOT NULL,
        stock_quantity INT NOT NULL DEFAULT 0 CHECK (stock_quantity >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        // Create customers table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS customers (
        customerid INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE,
        phone VARCHAR(20) UNIQUE NOT NULL,
        address TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
        // Create orders table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS orders (
        orderid INT AUTO_INCREMENT PRIMARY KEY,
        customerid INT,
        total_amount DECIMAL(10,2) NOT NULL CHECK (total_amount >= 0),
        status ENUM('pending', 'completed', 'cancelled') NOT NULL DEFAULT 'pending',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customerid) REFERENCES customers(customerid)
      )
    `);
        // Create order_items table
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS order_items (
        order_itemid INT AUTO_INCREMENT PRIMARY KEY,
        orderid INT NOT NULL,
        itemid INT NOT NULL,
        quantity INT NOT NULL CHECK (quantity > 0),
        price DECIMAL(10,2) NOT NULL CHECK (price >= 0),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (orderid) REFERENCES orders(orderid) ON DELETE CASCADE,
        FOREIGN KEY (itemid) REFERENCES items(itemid)
      )
    `);
        // Create default admin user if not exists
        await connection.execute(`
      INSERT IGNORE INTO users (username, email, role, password)
      VALUES ('admin', 'admin@pos.com', 'admin', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi')
    `);
        console.log('✅ Database tables created/verified successfully');
    }
    catch (error) {
        console.error('❌ Error creating tables:', error);
        throw error;
    }
    finally {
        connection.release();
    }
};
// Query helper functions
export const query = async (text, params) => {
    const start = Date.now();
    try {
        const [rows] = await pool.execute(text, params);
        const duration = Date.now() - start;
        console.log('Executed query', { text, duration, rows: Array.isArray(rows) ? rows.length : 'N/A' });
        return { rows };
    }
    catch (error) {
        console.error('Query error:', error);
        throw error;
    }
};
export const getClient = async () => {
    return await pool.getConnection();
};
export default pool;
//# sourceMappingURL=database.js.map