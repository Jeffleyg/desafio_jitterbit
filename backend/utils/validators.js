const Joi = require('joi');

const pedidoSchema = Joi.object({
    numeroPedido: Joi.string().min(3).required(),
    valorTotal: Joi.number().positive().required(),
    dataCriacao: Joi.date().iso().required(),
    items: Joi.array().items(
        Joi.object({
            idItem: Joi.alternatives().try(
                Joi.number().integer().positive(),
                Joi.string().pattern(/^\d+$/)
            ).required(),
            quantidadeItem: Joi.number().integer().min(1).required(),
            valorItem: Joi.number().positive().required()
        })
    ).min(1).required()
});

module.exports = { pedidoSchema };