const express = require('express');
const router = express.Router();
const categoriaController = require('../controllers/categoriaController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Categorias
 *   description: CRUD de categorias protegido por token JWT.
 */

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
 *         description: Categorias encontradas.
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
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria encontrada.
 *       404:
 *         description: Categoria nao encontrada.
 */
router.get('/:id', categoriaController.buscarCategoria);

/**
 * @swagger
 * /api/categorias:
 *   post:
 *     summary: Cria uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Bebidas
 *     responses:
 *       201:
 *         description: Categoria criada.
 *       400:
 *         description: Nome ausente.
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
 *         description: ID da categoria.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nome]
 *             properties:
 *               nome:
 *                 type: string
 *                 example: Bebidas
 *     responses:
 *       200:
 *         description: Categoria atualizada.
 *       404:
 *         description: Categoria nao encontrada.
 */
router.patch('/:id', categoriaController.atualizarCategoria);

/**
 * @swagger
 * /api/categorias/{id}:
 *   delete:
 *     summary: Remove uma categoria
 *     tags: [Categorias]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID da categoria.
 *     responses:
 *       200:
 *         description: Categoria removida.
 *       404:
 *         description: Categoria nao encontrada.
 */
router.delete('/:id', categoriaController.deletarCategoria);

module.exports = router;
