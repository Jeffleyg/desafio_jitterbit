const orderService = require('../service/orderService');
const { pedidoSchema } = require('../utils/validators');
const logger = require('../utils/logger');

const criar = async (req, res) => {
    logger.info(`[Controller] Iniciando criação de pedido para usuário ${req.userId}`);
    
    // Validação de entrada
    const { error } = pedidoSchema.validate(req.body);
    if (error) {
        logger.warn(`[Controller] Falha na validação: ${error.details[0].message}`);
        return res.status(400).json({ error: error.details[0].message });
    }

    try {
        const pedido = await orderService.criarOrder(req.body);
        return res.status(201).json(pedido);
    } catch (error) {
        return res.status(500).json({ message: "Erro interno ao criar pedido" });
    }
};


module.exports = { criar };