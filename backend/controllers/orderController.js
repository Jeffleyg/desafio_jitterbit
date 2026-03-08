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
const getAll = async (req, res) => {
    logger.info(`[Controller] Listagem geral solicitada pelo usuário ${req.userId}`);
    try {
        const pedidos = await orderService.encontrarAllOrders();
        return res.status(200).json(pedidos);
    } catch (error) {
        return res.status(500).json({ message: "Erro ao recuperar lista de pedidos" });
    }
};

const getById = async (req, res) => {
    const { id } = req.params;
    try {
        const pedido = await orderService.encontrarOrderPorId(id);
        return res.status(200).json(pedido);
    } catch (error) {
        if (error.message === 'ORDER_NOT_FOUND') {
            return res.status(404).json({ message: "Pedido inexistente" });
        }
        return res.status(500).json({ message: "Erro ao processar busca" });
    }
};

const atualizar = async (req, res) => {
    const { id } = req.params;
    logger.info(`[Controller] Solicitação de atualização para o pedido ${id}`);
    try {
        await orderService.atualizarOrder(id, req.body);
        return res.status(200).json({ message: "Pedido atualizado com sucesso" });
    } catch (error) {
        return res.status(404).json({ message: "Não foi possível atualizar o pedido" });
    }
};

const remove = async (req, res) => {
    const { id } = req.params;
    logger.warn(`[Controller] Executando exclusão do pedido ${id}`);
    try {
        await orderService.deleteOrder(id);
        return res.status(204).send();
    } catch (error) {
        return res.status(404).json({ message: "Erro ao remover pedido: ID não encontrado" });
    }
};


module.exports = { criar, getAll, getById, atualizar, remove };