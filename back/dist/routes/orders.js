import express from 'express';
import { query, getClient } from '../config/database.js';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { validateOrderCreation, validateOrderUpdate, validateIdParam, handleValidationErrors } from '../validators/index.js';
const router = express.Router();
/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of orders retrieved successfully
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
 *                     $ref: '#/components/schemas/Order'
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        // Get orders with customer info
        const ordersResult = await query(`
      SELECT o.orderid, o.customerid, o.total_amount, o.status, o.created_at, o.updated_at,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customerid = c.customerid
      ORDER BY o.created_at DESC
    `);
        // Get order items for each order
        const ordersWithItems = await Promise.all(ordersResult.rows.map(async (order) => {
            const itemsResult = await query(`
          SELECT oi.itemid, oi.quantity, oi.price, i.name, i.category
          FROM order_items oi
          JOIN items i ON oi.itemid = i.itemid
          WHERE oi.orderid = ?
        `, [order.orderid]);
            return {
                ...order,
                items: itemsResult.rows.map((item) => ({
                    itemid: item.itemid,
                    quantity: item.quantity,
                    price: parseFloat(item.price),
                    name: item.name,
                    category: item.category
                }))
            };
        }));
        res.json({
            success: true,
            data: ordersWithItems
        });
    }
    catch (error) {
        console.error('Get orders error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve orders'
        });
    }
});
/**
 * @swagger
 * /api/orders/{orderid}:
 *   get:
 *     summary: Get an order by ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get('/:orderid', authenticateToken, requireAdmin, validateIdParam, async (req, res) => {
    try {
        const { orderid } = req.params;
        // Get order with customer info
        const orderResult = await query(`
      SELECT o.orderid, o.customerid, o.total_amount, o.status, o.created_at, o.updated_at,
             c.name as customer_name, c.email as customer_email, c.phone as customer_phone
      FROM orders o
      LEFT JOIN customers c ON o.customerid = c.customerid
      WHERE o.orderid = ?
    `, [orderid]);
        if (orderResult.rows.length === 0) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        // Get order items
        const itemsResult = await query(`
      SELECT oi.itemid, oi.quantity, oi.price, i.name, i.category
      FROM order_items oi
      JOIN items i ON oi.itemid = i.itemid
      WHERE oi.orderid = ?
    `, [orderid]);
        const order = {
            ...orderResult.rows[0],
            items: itemsResult.rows.map((item) => ({
                itemid: item.itemid,
                quantity: item.quantity,
                price: parseFloat(item.price),
                name: item.name,
                category: item.category
            }))
        };
        res.json({
            success: true,
            data: order
        });
    }
    catch (error) {
        console.error('Get order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to retrieve order'
        });
    }
});
/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               customerid:
 *                 type: integer
 *                 description: Customer ID (optional)
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required:
 *                     - itemid
 *                     - quantity
 *                   properties:
 *                     itemid:
 *                       type: integer
 *                       description: Item ID
 *                     quantity:
 *                       type: integer
 *                       description: Quantity ordered
 *     responses:
 *       201:
 *         description: Order created successfully
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
 *                   example: "Order created successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       400:
 *         description: Validation error or insufficient stock
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post('/', authenticateToken, requireAdmin, validateOrderCreation, handleValidationErrors, async (req, res) => {
    const client = await getClient();
    try {
        await client.execute('START TRANSACTION');
        const { customerid, items } = req.body;
        // Validate items exist and have sufficient stock
        for (const item of items) {
            const [itemRows] = await client.execute(`
        SELECT itemid, name, price, stock_quantity
        FROM items
        WHERE itemid = ?
      `, [item.itemid]);
            if (itemRows.length === 0) {
                await client.execute('ROLLBACK');
                res.status(400).json({
                    success: false,
                    message: `Item with ID ${item.itemid} not found`
                });
                return;
            }
            if (itemRows[0].stock_quantity < item.quantity) {
                await client.execute('ROLLBACK');
                res.status(400).json({
                    success: false,
                    message: `Insufficient stock for item: ${itemRows[0].name}`
                });
                return;
            }
        }
        // Calculate total amount
        let totalAmount = 0;
        const orderItemsWithPrices = [];
        for (const item of items) {
            const [itemRows] = await client.execute(`
        SELECT price FROM items WHERE itemid = ?
      `, [item.itemid]);
            const price = parseFloat(itemRows[0].price);
            totalAmount += price * item.quantity;
            orderItemsWithPrices.push({
                itemid: item.itemid,
                quantity: item.quantity,
                price: price
            });
        }
        // Create order
        await client.execute(`
      INSERT INTO orders (customerid, total_amount, status)
      VALUES (?, ?, 'pending')
    `, [customerid, totalAmount]);
        // Get the inserted order ID
        const [orderIdResult] = await client.execute('SELECT LAST_INSERT_ID() as orderid');
        const newOrderId = orderIdResult[0].orderid;
        // Create order items and update stock
        for (const item of orderItemsWithPrices) {
            await client.execute(`
        INSERT INTO order_items (orderid, itemid, quantity, price)
        VALUES (?, ?, ?, ?)
      `, [newOrderId, item.itemid, item.quantity, item.price]);
            // Update stock quantity
            await client.execute(`
        UPDATE items
        SET stock_quantity = stock_quantity - ?, updated_at = CURRENT_TIMESTAMP
        WHERE itemid = ?
      `, [item.quantity, item.itemid]);
        }
        await client.execute('COMMIT');
        // Get complete order with items for response
        const [orderRows] = await client.execute(`
      SELECT orderid, customerid, total_amount, status, created_at, updated_at
      FROM orders
      WHERE orderid = ?
    `, [newOrderId]);
        const completeOrder = {
            ...orderRows[0],
            items: orderItemsWithPrices
        };
        res.status(201).json({
            success: true,
            message: 'Order created successfully',
            data: completeOrder
        });
    }
    catch (error) {
        await client.execute('ROLLBACK');
        console.error('Create order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to create order'
        });
    }
    finally {
        client.release();
    }
});
/**
 * @swagger
 * /api/orders/{orderid}:
 *   put:
 *     summary: Update an order status
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, completed, cancelled]
 *                 description: Order status
 *     responses:
 *       200:
 *         description: Order updated successfully
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
 *                   example: "Order updated successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Order'
 *       403:
 *         description: Access denied
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.put('/:orderid', authenticateToken, requireAdmin, validateIdParam, validateOrderUpdate, handleValidationErrors, async (req, res) => {
    try {
        const { orderid } = req.params;
        const { status } = req.body;
        const result = await query(`
      UPDATE orders
      SET status = ?, updated_at = CURRENT_TIMESTAMP
      WHERE orderid = ?
    `, [status, orderid]);
        if (result.rows.affectedRows === 0) {
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        // Get updated order
        const [orderRows] = await (await getClient()).execute(`
      SELECT orderid, customerid, total_amount, status, created_at, updated_at
      FROM orders
      WHERE orderid = ?
    `, [orderid]);
        // Get order items for complete response
        const itemsResult = await query(`
      SELECT oi.itemid, oi.quantity, oi.price, i.name, i.category
      FROM order_items oi
      JOIN items i ON oi.itemid = i.itemid
      WHERE oi.orderid = ?
    `, [orderid]);
        const order = {
            ...orderRows[0],
            items: itemsResult.rows.map((item) => ({
                itemid: item.itemid,
                quantity: item.quantity,
                price: parseFloat(item.price),
                name: item.name,
                category: item.category
            }))
        };
        res.json({
            success: true,
            message: 'Order updated successfully',
            data: order
        });
    }
    catch (error) {
        console.error('Update order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update order'
        });
    }
});
/**
 * @swagger
 * /api/orders/{orderid}:
 *   delete:
 *     summary: Delete an order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderid
 *         required: true
 *         schema:
 *           type: integer
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
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
 *                   example: "Order deleted successfully"
 *       403:
 *         description: Admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete('/:orderid', authenticateToken, requireAdmin, validateIdParam, async (req, res) => {
    const client = await getClient();
    try {
        await client.execute('START TRANSACTION');
        const { orderid } = req.params;
        // Get order items before deletion to restore stock
        const [itemsRows] = await client.execute(`
      SELECT itemid, quantity FROM order_items WHERE orderid = ?
    `, [orderid]);
        // Restore stock quantities
        for (const item of itemsRows) {
            await client.execute(`
        UPDATE items
        SET stock_quantity = stock_quantity + ?, updated_at = CURRENT_TIMESTAMP
        WHERE itemid = ?
      `, [item.quantity, item.itemid]);
        }
        // Delete order (cascade will delete order_items)
        const [result] = await client.execute(`
      DELETE FROM orders
      WHERE orderid = ?
    `, [orderid]);
        if (result.affectedRows === 0) {
            await client.execute('ROLLBACK');
            res.status(404).json({
                success: false,
                message: 'Order not found'
            });
            return;
        }
        await client.execute('COMMIT');
        res.json({
            success: true,
            message: 'Order deleted successfully'
        });
    }
    catch (error) {
        await client.execute('ROLLBACK');
        console.error('Delete order error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete order'
        });
    }
    finally {
        client.release();
    }
});
export default router;
//# sourceMappingURL=orders.js.map