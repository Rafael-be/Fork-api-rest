require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');

require('./config/database'); 

const apiRoutes = require('./src/routes/apiRoutes');
const authRoutes = require('./src/routes/authRoutes'); 
const categoriaRoutes = require('./src/routes/categoriaRoutes'); 

const app = express();
app.use(express.json());

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API rest utilizando node.js, express e MySQL',
      version: '2.0.0',
      description: 'API REST refatorada para banco de dados relacional (MySQL).'
    },
    servers: [{ url: 'http://localhost:3000' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/api', apiRoutes); 
app.use('/api/auth', authRoutes);
app.use('/api/categorias', categoriaRoutes); 

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));