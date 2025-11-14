import express, { Request, Response } from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin, requireAdminOrSelf } from '../middleware/auth.js';
import { hashPassword } from '../utils/auth.js';
import { validateUserCreation, validateUserUpdate, validateIdParam, handleValidationErrors } from '../validators/index.js';
import { User, CreateUserRequest, UpdateUserRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get all users
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/User'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, requireAdmin, async (req: Request, res: Response): Promise<void> => {
  try {
    const result = await query(`
      SELECT userid, username, email, role, created_at, updated_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows as User[]
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve users'
    });
  }
});

/**
 * @swagger
 * /api/users/{userid}:
 *   get:
 *     summary: Get a user by ID
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:userid', authenticateToken, requireAdminOrSelf, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userid } = req.params;

    const result = await query(`
      SELECT userid, username, email, role, created_at, updated_at
      FROM users
      WHERE userid = ?
    `, [userid]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0] as User
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve user'
    });
  }
});

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - email
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               password:
 *                 type: string
 *                 description: User's password
 *               role:
 *                 type: string
 *                 enum: [admin, cashier]
 *                 description: User's role
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, requireAdmin, validateUserCreation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password, role }: CreateUserRequest = req.body;

    const hashedPassword = await hashPassword(password);

    const result = await query(`
      INSERT INTO users (username, email, role, password)
      VALUES (?, ?, ?, ?)
    `, [username, email, role || 'cashier', hashedPassword]);

    // Get the inserted user
    const userResult = await query(`
      SELECT userid, username, email, role, created_at, updated_at
      FROM users
      WHERE userid = LAST_INSERT_ID()
    `);

    res.status(201).json({
      success: true,
      message: 'User created successfully',
      data: userResult.rows[0] as User
    });
  } catch (error) {
    console.error('Create user error:', error);

    if ((error as any).code === 'ER_DUP_ENTRY') { // Unique constraint violation
      res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create user'
    });
  }
});

/**
 * @swagger
 * /api/users/{userid}:
 *   put:
 *     summary: Update a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: User's username
 *               email:
 *                 type: string
 *                 format: email
 *                 description: User's email address
 *               role:
 *                 type: string
 *                 enum: [admin, cashier]
 *                 description: User's role
 *               password:
 *                 type: string
 *                 description: User's new password
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:userid', authenticateToken, requireAdminOrSelf, validateIdParam, validateUserUpdate, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userid } = req.params;
    const { username, email, role, password }: UpdateUserRequest = req.body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];

    if (username !== undefined) {
      updates.push(`username = ?`);
      values.push(username);
    }

    if (email !== undefined) {
      updates.push(`email = ?`);
      values.push(email);
    }

    if (role !== undefined) {
      updates.push(`role = ?`);
      values.push(role);
    }

    if (password !== undefined) {
      const hashedPassword = await hashPassword(password);
      updates.push(`password = ?`);
      values.push(hashedPassword);
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
      return;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(userid);

    const result = await query(`
      UPDATE users
      SET ${updates.join(', ')}
      WHERE userid = ?
    `, values);

    // Get the updated user
    const userResult = await query(`
      SELECT userid, username, email, role, created_at, updated_at
      FROM users
      WHERE userid = ?
    `, [userid]);

    if (result.rows.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      data: userResult.rows[0] as User
    });
  } catch (error) {
    console.error('Update user error:', error);

    if ((error as any).code === 'ER_DUP_ENTRY') { // Unique constraint violation
      res.status(400).json({
        success: false,
        message: 'Username or email already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update user'
    });
  }
});

/**
 * @swagger
 * /api/users/{userid}:
 *   delete:
 *     summary: Delete a user
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userid
 *         required: true
 *         schema:
 *           type: integer
 *         description: User ID
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:userid', authenticateToken, requireAdmin, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { userid } = req.params;

    const result = await query(`
      DELETE FROM users
      WHERE userid = ?
    `, [userid]);

    if (result.rows.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete user'
    });
  }
});

export default router;