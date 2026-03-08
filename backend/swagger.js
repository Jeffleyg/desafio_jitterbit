const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Order API',
      version: '1.0.0',
      description: 'API para gerenciamento de pedidos',
      contact: {
        name: 'Softex'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de desenvolvimento'
      }
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      },
      schemas: {
        Item: {
          type: 'object',
          properties: {
            productId: {
              type: 'integer',
              description: 'ID do produto'
            },
            quantity: {
              type: 'integer',
              description: 'Quantidade do produto'
            },
            price: {
              type: 'number',
              description: 'Preço do produto'
            }
          },
          required: ['productId', 'quantity', 'price']
        },
        Order: {
          type: 'object',
          properties: {
            orderId: {
              type: 'string',
              description: 'ID do pedido'
            },
            value: {
              type: 'number',
              description: 'Valor total do pedido'
            },
            creationDate: {
              type: 'string',
              format: 'date-time',
              description: 'Data de criação do pedido'
            },
            items: {
              type: 'array',
              items: {
                $ref: '#/components/schemas/Item'
              }
            }
          },
          required: ['value', 'items']
        },
        IncomingOrder: {
          type: 'object',
          properties: {
            numeroPedido: {
              type: 'string',
              example: 'v10089015vdb-01'
            },
            valorTotal: {
              type: 'number',
              example: 10000
            },
            dataCriacao: {
              type: 'string',
              format: 'date-time',
              example: '2023-07-19T12:24:11.5299601+00:00'
            },
            items: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  idItem: {
                    type: 'string',
                    example: '2434'
                  },
                  quantidadeItem: {
                    type: 'integer',
                    example: 1
                  },
                  valorItem: {
                    type: 'number',
                    example: 1000
                  }
                },
                required: ['idItem', 'quantidadeItem', 'valorItem']
              }
            }
          },
          required: ['numeroPedido', 'valorTotal', 'dataCriacao', 'items']
        }
      }
    }
  },
  apis: ['./routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = specs;
