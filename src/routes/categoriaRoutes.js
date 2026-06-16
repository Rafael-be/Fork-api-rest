const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: CRUD Estrito de Categorias (Requer Token)
 */

// Aplica o middleware de autenticação em TODAS as rotas deste arquivo
router.use(autenticacaoMiddleware.verificarToken);

/**
 * @swagger
 * /api/categorias:
 *   get:
 *     summary: Lista todas as categorias
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/', categoriaController.listarCategorias);

/**
 * @swagger
 * /api/categorias/{id}:
 *   get:
 *     summary: Busca uma categoria pelo ID
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Sucesso
 */
router.get('/:id', categoriaController.buscarCategoria);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma nova categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       201:
 *         description: Criado com sucesso
 */
router.post('/', categoriaController.criarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   patch:
 *     summary: Atualiza uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *     responses:
 *       200:
 *         description: Atualizado com sucesso
 */
router.patch('/:id', categoriaController.atualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Deleta uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Deletado com sucesso
 */
router.delete('/:id', categoriaController.deletarCategoria);

module.exports = router;