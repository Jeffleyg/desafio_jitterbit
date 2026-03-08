const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/auth');
const { pedidoSchema } = require('../utils/validators');
const logger = require('../utils/logger');

const validatePedido = (req, res, next) => {
    const { error } = pedidoSchema.validate(req.body);
    if (error) {
        logger.warn(`Validação falhou: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
    }
    next();
};

router.use(authMiddleware);

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Criar novo pedido
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/IncomingOrder'
 *     responses:
 *       201:
 *         description: Pedido criado com sucesso
 *       400:
 *         description: Erro na validação dos dados
 */
router.post('/', validatePedido, orderController.criar);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obter todos os pedidos
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de todos os pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 */


module.exports = router;