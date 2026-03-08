const prisma = require("../database");
const logger = require("../utils/logger");

class OrderService {
    normalizarOrderId(numeroPedido) {
        const pedido = String(numeroPedido || '');
        const match = pedido.match(/^([A-Za-z]*)(\d+)([A-Za-z]+)(?:-\d+)?$/);

        if (!match) {
            return pedido.replace(/-\d+$/, '');
        }

        const [, prefixo, numero, sufixo] = match;
        const proximoNumero = String(Number(numero) + 1).padStart(numero.length, '0');
        return `${prefixo}${proximoNumero}${sufixo}`;
    }

    mapearPayloadEntrada(payload) {
        return {
            orderId: this.normalizarOrderId(payload.numeroPedido),
            value: Number(payload.valorTotal),
            creationDate: new Date(payload.dataCriacao),
            items: payload.items.map((item) => ({
                productId: Number(item.idItem),
                quantity: Number(item.quantidadeItem),
                price: Number(item.valorItem)
            }))
        };
    }

    async criarOrder(orderData) {
        try {
            const mapped = this.mapearPayloadEntrada(orderData);
            const pedido = await prisma.order.create({
                data: {
                    orderId: mapped.orderId,
                    value: mapped.value,
                    creationDate: mapped.creationDate,
                    items: { create: mapped.items }
                },
                include: { items: true }
            });
            logger.info(`[Service] Pedido ${pedido.orderId} criado com sucesso no PostgreSQL.`);
            return pedido;
        } catch (error) {
            logger.error(`[Service] Erro ao persistir pedido: ${error.message}`, { stack: error.stack });
            throw error;
        }
    }
    async encontrarAllOrders() {
        try {
            const pedidos = await prisma.order.findMany({ include: { items: true } });
            logger.info(`[Service] Listagem de pedidos realizada. Total: ${pedidos.length}`);
            return pedidos;
        } catch (error) {
            logger.error(`[Service] Erro ao buscar todos os pedidos: ${error.message}`);
            throw error;
        }
    }

    async encontrarOrderPorId(id) {
        try {
            const order = await prisma.order.findUnique({
                where: { orderId: id },
                include: { items: true }
            });
            if (!order) {
                logger.warn(`[Service] Tentativa de busca: Pedido ${id} não existe.`);
                throw new Error("ORDER_NOT_FOUND");
            }
            return order;
        } catch (error) {
            logger.error(`[Service] Erro na busca por ID ${id}: ${error.message}`);
            throw error;
        }
    }

    async atualizarOrder(id, data) {
        try {
            const novoValor = data.valorTotal ?? data.value;
            const pedido = await prisma.order.update({
                where: { orderId: id },
                data: { value: Number(novoValor) }
            });
            logger.info(`[Service] Pedido ${id} atualizado com sucesso.`);
            return pedido;
        } catch (error) {
            logger.error(`[Service] Erro ao atualizar pedido ${id}: ${error.message}`);
            throw error;
        }
    }

    async deleteOrder(id) {
        try {
            await prisma.order.delete({ where: { orderId: id } });
            logger.info(`[Service] Pedido ${id} removido do sistema.`);
            return true;
        } catch (error) {
            logger.error(`[Service] Falha na exclusão do pedido ${id}: ${error.message}`);
            throw error;
        }
    }

}

module.exports = new OrderService();