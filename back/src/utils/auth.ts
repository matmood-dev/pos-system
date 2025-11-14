import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from '../config/database.js';
import { User, JWTPayload } from '../types/index.js';

// Hash password
export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return await bcrypt.hash(password, saltRounds);
};

// Verify password
export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  return await bcrypt.compare(password, hashedPassword);
};

// Generate JWT token
export const generateToken = (user: User): string => {
  const payload: JWTPayload = {
    userid: user.userid,
    username: user.username,
    role: user.role
  };

  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const token = jwt.sign(payload, secret as any);
  return token;
};

// Generate refresh token
export const generateRefreshToken = (user: User): string => {
  const payload = {
    userid: user.userid,
    username: user.username
  };

  const secret = process.env.JWT_SECRET || 'fallback_secret';
  const token = jwt.sign(payload, secret as any);
  return token;
};

// Verify user credentials
export const authenticateUser = async (username: string, password: string): Promise<User | null> => {
  try {
    const result = await query(
      'SELECT userid, username, email, password, role, created_at, updated_at FROM users WHERE username = ?',
      [username]
    );

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
    return userWithoutPassword as User;
  } catch (error) {
    throw error;
  }
};

// Create default admin user if none exists
export const createDefaultAdmin = async (): Promise<void> => {
  try {
    // Check if any users exist
    const userCheck = await query('SELECT COUNT(*) as count FROM users');
    if (userCheck.rows[0].count > 0) {
      return; // Users already exist
    }

    // Create default admin user
    const hashedPassword = await hashPassword('admin123');
    await query(
      `INSERT INTO users (username, email, role, password)
       VALUES (?, ?, ?, ?)`,
      ['admin', 'admin@pos.com', 'admin', hashedPassword]
    );

    console.log('✅ Default admin user created:');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   Please change the password after first login!');
  } catch (error) {
    console.error('❌ Error creating default admin:', error);
  }
};