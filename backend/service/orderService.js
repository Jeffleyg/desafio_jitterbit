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

}

module.exports = new OrderService();