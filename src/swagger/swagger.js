const swaggerJsdoc = require('swagger-jsdoc');

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
      },
      schemas: {
        Erro: {
          type: 'object',
          properties: {
            message: { type: 'string', example: 'Mensagem de erro' }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['usuario', 'senha'],
          properties: {
            usuario: { type: 'string', example: 'joao' },
            nome: { type: 'string', example: 'joao' },
            senha: { type: 'string', example: '123456' }
          }
        },
        CadastroRequest: {
          type: 'object',
          required: ['nome', 'senha'],
          properties: {
            nome: { type: 'string', example: 'joao' },
            senha: { type: 'string', example: '123456' },
            status: { type: 'string', example: 'ativo' }
          }
        },
        Categoria: {
          type: 'object',
          properties: {
            id_categoria: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Bebidas' }
          }
        },
        Cliente: {
          type: 'object',
          properties: {
            id_cliente: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Joao da Silva' },
            usuarios_id_usuario: { type: 'integer', example: 1 }
          }
        },
        ClienteRequest: {
          type: 'object',
          required: ['nome', 'id_usuario'],
          properties: {
            nome: { type: 'string', example: 'Joao da Silva' },
            id_usuario: { type: 'integer', example: 1 }
          }
        },
        Produto: {
          type: 'object',
          properties: {
            id_produto: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Refrigerante' },
            valor: { type: 'number', format: 'float', example: 8.5 },
            estoque: { type: 'integer', example: 20 },
            categorias_id_categoria: { type: 'integer', example: 1 }
          }
        },
        ProdutoRequest: {
          type: 'object',
          required: ['nome', 'valor', 'estoque', 'id_categoria'],
          properties: {
            nome: { type: 'string', example: 'Refrigerante' },
            valor: { type: 'number', format: 'float', example: 8.5 },
            estoque: { type: 'integer', example: 20 },
            id_categoria: { type: 'integer', example: 1 }
          }
        },
        Pedido: {
          type: 'object',
          properties: {
            id_pedido: { type: 'integer', example: 1 },
            data: { type: 'string', format: 'date-time', example: '2026-06-23 14:30:00' },
            clientes_id_cliente: { type: 'integer', example: 1 },
            produtos: {
              type: 'array',
              items: { $ref: '#/components/schemas/PedidoProduto' }
            }
          }
        },
        PedidoProduto: {
          type: 'object',
          properties: {
            produtos_id_produto: { type: 'integer', example: 1 },
            nome: { type: 'string', example: 'Refrigerante' },
            quantidade: { type: 'integer', example: 2 },
            valor_unitario: { type: 'number', format: 'float', example: 8.5 },
            valor_total: { type: 'number', format: 'float', example: 17 }
          }
        },
        PedidoProdutoRequest: {
          type: 'object',
          required: ['id_produto', 'quantidade'],
          properties: {
            id_produto: { type: 'integer', example: 1 },
            quantidade: { type: 'integer', example: 2 }
          }
        },
        PedidoRequest: {
          type: 'object',
          required: ['data', 'id_cliente', 'produtos'],
          properties: {
            data: { type: 'string', format: 'date-time', example: '2026-06-23 14:30:00' },
            id_cliente: { type: 'integer', example: 1 },
            produtos: {
              type: 'array',
              minItems: 1,
              items: { $ref: '#/components/schemas/PedidoProdutoRequest' }
            }
          }
        }
      }
    }
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsdoc(options);

module.exports = specs;
