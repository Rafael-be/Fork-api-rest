require('dotenv').config();
require('./config/database');

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const specs = require('./src/swagger/swagger');

const apiRoutes = require('./src/routes/apiRoutes');
const authRoutes = require('./src/routes/authRoutes');
const categoriaRoutes = require('./src/routes/categoriaRoutes');

const app = express();
app.use(express.json());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use('/api', apiRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));