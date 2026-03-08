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
router.get('/', orderController.getAll);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obter pedido por ID
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Detalhes do pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: Pedido não encontrado
 */
router.get('/:id', orderController.getById);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Atualizar pedido
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               value:
 *                 type: number
 *               items:
 *                 type: array
 *                 items:
 *                   $ref: '#/components/schemas/Item'
 *     responses:
 *       200:
 *         description: Pedido atualizado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.put('/:id', orderController.atualizar);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Deletar pedido
 *     tags: [Orders]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID do pedido
 *     responses:
 *       200:
 *         description: Pedido deletado com sucesso
 *       404:
 *         description: Pedido não encontrado
 */
router.delete('/:id', orderController.remove);


module.exports = router;