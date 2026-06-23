const express = require('express');
const router = express.Router();
const pedidoController = require('../controllers/pedidoController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Pedidos
 *   description: CRUD de pedidos protegido por token JWT.
 */

router.use(autenticacaoMiddleware.verificarToken);

/**
 * @swagger
 * /api/pedidos:
 *   get:
 *     summary: Lista todos os pedidos
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pedidos encontrados.
 */
router.get('/', pedidoController.listarPedidos);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   get:
 *     summary: Busca um pedido pelo ID
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido encontrado.
 *       404:
 *         description: Pedido nao encontrado.
 */
router.get('/:id', pedidoController.buscarPedido);

/**
 * @swagger
 * /api/pedidos:
 *   post:
 *     summary: Cria um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoRequest'
 *     responses:
 *       201:
 *         description: Pedido criado.
 *       400:
 *         description: Dados obrigatorios ausentes.
 */
router.post('/', pedidoController.criarPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   patch:
 *     summary: Atualiza um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PedidoRequest'
 *     responses:
 *       200:
 *         description: Pedido atualizado.
 *       404:
 *         description: Pedido nao encontrado.
 */
router.patch('/:id', pedidoController.atualizarPedido);

/**
 * @swagger
 * /api/pedidos/{id}:
 *   delete:
 *     summary: Remove um pedido
 *     tags: [Pedidos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do pedido.
 *     responses:
 *       200:
 *         description: Pedido removido.
 *       404:
 *         description: Pedido nao encontrado.
 */
router.delete('/:id', pedidoController.deletarPedido);

module.exports = router;
