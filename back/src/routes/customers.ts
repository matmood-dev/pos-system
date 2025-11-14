import express, { Request, Response } from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateCustomerCreation, validateCustomerUpdate, validateIdParam, handleValidationErrors } from '../validators/index.js';
import { Customer, CreateCustomerRequest, UpdateCustomerRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

/**
 * @swagger
 * /api/customers:
 *   get:
 *     summary: Get all customers
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of customers retrieved successfully
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
 *                     $ref: '#/components/schemas/Customer'
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
      SELECT customerid, name, email, phone, address, created_at, updated_at
      FROM customers
      ORDER BY created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows as Customer[]
    });
  } catch (error) {
    console.error('Get customers error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customers'
    });
  }
});

/**
 * @swagger
 * /api/customers/{customerid}:
 *   get:
 *     summary: Get a customer by ID
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:customerid', authenticateToken, requireAdmin, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerid } = req.params;

    const result = await query(`
      SELECT customerid, name, email, phone, address, created_at, updated_at
      FROM customers
      WHERE customerid = ?
    `, [customerid]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0] as Customer
    });
  } catch (error) {
    console.error('Get customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve customer'
    });
  }
});

/**
 * @swagger
 * /api/customers:
 *   post:
 *     summary: Create a new customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *               address:
 *                 type: string
 *                 description: Customer's address
 *     responses:
 *       201:
 *         description: Customer created successfully
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
 *                   example: "Customer created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, requireAdmin, validateCustomerCreation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, phone, address }: CreateCustomerRequest = req.body;

    const result = await query(`
      INSERT INTO customers (name, email, phone, address)
      VALUES (?, ?, ?, ?)
    `, [name, email, phone, address]);

    // Get the inserted customer
    const customerResult = await query(`
      SELECT customerid, name, email, phone, address, created_at, updated_at
      FROM customers
      WHERE customerid = LAST_INSERT_ID()
    `);

    res.status(201).json({
      success: true,
      message: 'Customer created successfully',
      data: customerResult.rows[0] as Customer
    });
  } catch (error) {
    console.error('Create customer error:', error);

    if ((error as any).code === 'ER_DUP_ENTRY') { // Unique constraint violation
      res.status(400).json({
        success: false,
        message: 'Customer with this email or phone already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to create customer'
    });
  }
});

/**
 * @swagger
 * /api/customers/{customerid}:
 *   put:
 *     summary: Update a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: Customer's name
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Customer's email address
 *               phone:
 *                 type: string
 *                 description: Customer's phone number
 *               address:
 *                 type: string
 *                 description: Customer's address
 *     responses:
 *       200:
 *         description: Customer updated successfully
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
 *                   example: "Customer updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Customer'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:customerid', authenticateToken, requireAdmin, validateIdParam, validateCustomerUpdate, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerid } = req.params;
    const { name, email, phone, address }: UpdateCustomerRequest = req.body;

    // Build dynamic update query
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (email !== undefined) {
      updates.push(`email = $${paramCount}`);
      values.push(email);
      paramCount++;
    }

    if (phone !== undefined) {
      updates.push(`phone = $${paramCount}`);
      values.push(phone);
      paramCount++;
    }

    if (address !== undefined) {
      updates.push(`address = $${paramCount}`);
      values.push(address);
      paramCount++;
    }

    if (updates.length === 0) {
      res.status(400).json({
        success: false,
        message: 'No fields to update'
      });
      return;
    }

    updates.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(customerid);

    const result = await query(`
      UPDATE customers
      SET ${updates.join(', ')}
      WHERE customerid = ?
    `, values);

    // Get the updated customer
    const customerResult = await query(`
      SELECT customerid, name, email, phone, address, created_at, updated_at
      FROM customers
      WHERE customerid = ?
    `, [customerid]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Customer updated successfully',
      data: customerResult.rows[0] as Customer
    });
  } catch (error) {
    console.error('Update customer error:', error);

    if ((error as any).code === 'ER_DUP_ENTRY') { // Unique constraint violation
      res.status(400).json({
        success: false,
        message: 'Customer with this email or phone already exists'
      });
      return;
    }

    res.status(500).json({
      success: false,
      message: 'Failed to update customer'
    });
  }
});

/**
 * @swagger
 * /api/customers/{customerid}:
 *   delete:
 *     summary: Delete a customer
 *     tags: [Customers]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: customerid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Customer ID
 *     responses:
 *       200:
 *         description: Customer deleted successfully
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
 *                   example: "Customer deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Customer not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:customerid', authenticateToken, requireAdmin, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { customerid } = req.params;

    const result = await query(`
      DELETE FROM customers
      WHERE customerid = ?
    `, [customerid]);

    if (result.rows.affectedRows === 0) {
      res.status(404).json({
        success: false,
        message: 'Customer not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Customer deleted successfully'
    });
  } catch (error) {
    console.error('Delete customer error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete customer'
    });
  }
});

export default router;