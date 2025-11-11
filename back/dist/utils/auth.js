import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
// Hash password
export const hashPassword = async (password) => {
    const saltRounds = 12;
    return await bcrypt.hash(password, saltRounds);
};
// Verify password
export const verifyPassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password, hashedPassword);
};
// Generate JWT token
export const generateToken = (user) => {
    const payload = {
        userid: user.userid,
        username: user.username,
        role: user.role
    };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(payload, secret);
    return token;
};
// Generate refresh token
export const generateRefreshToken = (user) => {
    const payload = {
        userid: user.userid,
        username: user.username
    };
    const secret = process.env.JWT_SECRET || 'fallback_secret';
    const token = jwt.sign(payload, secret);
    return token;
};
// Verify user credentials
export const authenticateUser = async (username, password) => {
    try {
        const result = await query('SELECT userid, username, email, password, role, created_at, updated_at FROM users WHERE username = $1', [username]);
        if (result.rows.length === 0) {
            return null;
        }
        const user = result.rows[0];
        const isValidPassword = await verifyPassword(password, user.password);
        if (!isValidPassword) {
            return null;
        }
        // Remove password from user object
        const { password: _, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
    catch (error) {
        throw error;
    }
};
// Create default admin user if none exists
export const createDefaultAdmin = async () => {
    try {
        // Check if any users exist
        const userCheck = await query('SELECT COUNT(*) as count FROM users');
        if (userCheck.rows[0].count > 0) {
            return; // Users already exist
        }
        // Create default admin user
        const hashedPassword = await hashPassword('admin123');
        await query(`INSERT INTO users (username, email, role, password)
       VALUES ($1, $2, $3, $4)`, ['admin', 'admin@pos.com', 'admin', hashedPassword]);
        console.log('✅ Default admin user created:');
        console.log('   Username: admin');
        console.log('   Password: admin123');
        console.log('   Please change the password after first login!');
    }
    catch (error) {
        console.error('❌ Error creating default admin:', error);
    }
};
//# sourceMappingURL=auth.js.map