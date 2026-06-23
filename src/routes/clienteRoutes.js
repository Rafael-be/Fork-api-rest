const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Clientes
 *   description: CRUD de clientes protegido por token JWT.
 */

router.use(autenticacaoMiddleware.verificarToken);

/**
 * @swagger
 * /api/clientes:
 *   get:
 *     summary: Lista todos os clientes
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Clientes encontrados.
 */
router.get('/', clienteController.listarClientes);

/**
 * @swagger
 * /api/clientes/{id}:
 *   get:
 *     summary: Busca um cliente pelo ID
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Cliente encontrado.
 *       404:
 *         description: Cliente nao encontrado.
 */
router.get('/:id', clienteController.buscarCliente);

/**
 * @swagger
 * /api/clientes:
 *   post:
 *     summary: Cria um cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteRequest'
 *     responses:
 *       201:
 *         description: Cliente criado.
 *       400:
 *         description: Dados obrigatorios ausentes.
 */
router.post('/', clienteController.criarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   patch:
 *     summary: Atualiza um cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ClienteRequest'
 *     responses:
 *       200:
 *         description: Cliente atualizado.
 *       404:
 *         description: Cliente nao encontrado.
 */
router.patch('/:id', clienteController.atualizarCliente);

/**
 * @swagger
 * /api/clientes/{id}:
 *   delete:
 *     summary: Remove um cliente
 *     tags: [Clientes]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do cliente.
 *     responses:
 *       200:
 *         description: Cliente removido.
 *       404:
 *         description: Cliente nao encontrado.
 */
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;
