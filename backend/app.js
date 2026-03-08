require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerDocs = require('./swagger');
const orderRoutes = require('./routes/orderRoutes');
const logger = require('./utils/logger');

const app = express();

app.use(express.json());

// Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Rotas
app.use('/api/orders', orderRoutes);

// Middleware global de tratamento de erros
app.use((err, req, res, next) => {
    logger.error(err.stack);
    res.status(500).json({ error: 'Algo correu mal no servidor!' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor a correr na porta ${PORT}`);
    logger.info(`Servidor iniciado na porta ${PORT}`);
});