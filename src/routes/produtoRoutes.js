const express = require('express');
const router = express.Router();
const produtoController = require('../controllers/produtoController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Produtos
 *   description: CRUD de produtos protegido por token JWT.
 */

router.use(autenticacaoMiddleware.verificarToken);

/**
 * @swagger
 * /api/produtos:
 *   get:
 *     summary: Lista todos os produtos
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Produtos encontrados.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 resultados:
 *                   type: integer
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Produto'
 *       401:
 *         description: Token ausente, invalido ou expirado.
 */
router.get('/', produtoController.listarProdutos);

/**
 * @swagger
 * /api/produtos/{id}:
 *   get:
 *     summary: Busca um produto pelo ID
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto encontrado.
 *       404:
 *         description: Produto nao encontrado.
 */
router.get('/:id', produtoController.buscarProduto);

/**
 * @swagger
 * /api/produtos:
 *   post:
 *     summary: Cria um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoRequest'
 *     responses:
 *       201:
 *         description: Produto criado.
 *       400:
 *         description: Dados obrigatorios ausentes.
 */
router.post('/', produtoController.criarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   patch:
 *     summary: Atualiza um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProdutoRequest'
 *     responses:
 *       200:
 *         description: Produto atualizado.
 *       404:
 *         description: Produto nao encontrado.
 */
router.patch('/:id', produtoController.atualizarProduto);

/**
 * @swagger
 * /api/produtos/{id}:
 *   delete:
 *     summary: Remove um produto
 *     tags: [Produtos]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do produto.
 *     responses:
 *       200:
 *         description: Produto removido.
 *       404:
 *         description: Produto nao encontrado.
 */
router.delete('/:id', produtoController.deletarProduto);

module.exports = router;
