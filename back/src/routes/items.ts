import express, { Request, Response } from 'express';
import { query } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateItemCreation, validateItemUpdate, validateIdParam, handleValidationErrors } from '../validators/index.js';
import { Item, CreateItemRequest, UpdateItemRequest, ApiResponse } from '../types/index.js';

const router = express.Router();

/**
 * @swagger
 * /api/items:
 *   get:
 *     summary: Get all items
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter by category
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search in name and description
 *     responses:
 *       200:
 *         description: List of items retrieved successfully
 */
router.get('/', authenticateToken, async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, search } = req.query;

    let queryText = `
      SELECT itemid, name, description, price, category, stock_quantity, created_at, updated_at
      FROM items
      WHERE 1=1
    `;
    const values: any[] = [];

    if (category) {
      queryText += ` AND category = $1`;
      values.push(category);
    }

    if (search) {
      queryText += ` AND (name ILIKE $2 OR description ILIKE $2)`;
      values.push(`%${search}%`);
    }

    queryText += ` ORDER BY name ASC`;

    const result = await query(queryText, values);

    res.json({
      success: true,
      data: result.rows as Item[]
    });
  } catch (error) {
    console.error('Get items error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve items'
    });
  }
});

/**
 * @swagger
 * /api/items/{itemid}:
 *   get:
 *     summary: Get an item by ID
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemid
 *         required: true
 *         schema:
 *           type: integer
 */
router.get('/:itemid', authenticateToken, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemid } = req.params;

    const result = await query(`
      SELECT itemid, name, description, price, category, stock_quantity, created_at, updated_at
      FROM items
      WHERE itemid = $1
    `, [itemid]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0] as Item
    });
  } catch (error) {
    console.error('Get item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to retrieve item'
    });
  }
});

/**
 * @swagger
 * /api/items:
 *   post:
 *     summary: Create a new item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 */
router.post('/', authenticateToken, requireAdmin, validateItemCreation, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, description, price, category, stock_quantity }: CreateItemRequest = req.body;

    const result = await query(`
      INSERT INTO items (name, description, price, category, stock_quantity)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING itemid, name, description, price, category, stock_quantity, created_at, updated_at
    `, [name, description || null, price, category, stock_quantity]);

    res.status(201).json({
      success: true,
      message: 'Item created successfully',
      data: result.rows[0] as Item
    });
  } catch (error) {
    console.error('Create item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create item'
    });
  }
});

/**
 * @swagger
 * /api/items/{itemid}:
 *   put:
 *     summary: Update an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 */
router.put('/:itemid', authenticateToken, requireAdmin, validateIdParam, validateItemUpdate, handleValidationErrors, async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemid } = req.params;
    const { name, description, price, category, stock_quantity }: UpdateItemRequest = req.body;

    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (name !== undefined) {
      updates.push(`name = $${paramCount}`);
      values.push(name);
      paramCount++;
    }

    if (description !== undefined) {
      updates.push(`description = $${paramCount}`);
      values.push(description);
      paramCount++;
    }

    if (price !== undefined) {
      updates.push(`price = $${paramCount}`);
      values.push(price);
      paramCount++;
    }

    if (category !== undefined) {
      updates.push(`category = $${paramCount}`);
      values.push(category);
      paramCount++;
    }

    if (stock_quantity !== undefined) {
      updates.push(`stock_quantity = $${paramCount}`);
      values.push(stock_quantity);
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
    values.push(itemid);

    const result = await query(`
      UPDATE items
      SET ${updates.join(', ')}
      WHERE itemid = $${paramCount}
      RETURNING itemid, name, description, price, category, stock_quantity, created_at, updated_at
    `, values);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: result.rows[0] as Item
    });
  } catch (error) {
    console.error('Update item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update item'
    });
  }
});

/**
 * @swagger
 * /api/items/{itemid}:
 *   delete:
 *     summary: Delete an item
 *     tags: [Items]
 *     security:
 *       - bearerAuth: []
 */
router.delete('/:itemid', authenticateToken, requireAdmin, validateIdParam, async (req: Request, res: Response): Promise<void> => {
  try {
    const { itemid } = req.params;

    const result = await query(`
      DELETE FROM items
      WHERE itemid = $1
      RETURNING itemid
    `, [itemid]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: 'Item not found'
      });
      return;
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
    });
  } catch (error) {
    console.error('Delete item error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete item'
    });
  }
});

export default router;