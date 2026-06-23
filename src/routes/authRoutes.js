const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/autenticacaoMiddleware');

/**
 * @swagger
 * tags:
 *   name: Autenticacao
 *   description: Login, cadastro e administracao de usuarios.
 */

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica um usuario e gera token JWT
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginRequest'
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 *       400:
 *         description: Usuario ou senha ausentes.
 *       401:
 *         description: Usuario ou senha incorretos.
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /api/auth/cadastro:
 *   post:
 *     summary: Cadastra um usuario
 *     tags: [Autenticacao]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CadastroRequest'
 *     responses:
 *       201:
 *         description: Usuario cadastrado.
 *       400:
 *         description: Dados ausentes ou usuario ja existente.
 */
router.post('/cadastro', authController.cadastro);

/**
 * @swagger
 * /api/auth/{id}:
 *   delete:
 *     summary: Remove o usuario autenticado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuario. Deve coincidir com o token.
 *     responses:
 *       201:
 *         description: Usuario removido.
 *       403:
 *         description: Token e ID nao coincidem.
 */
router.delete('/:id', authMiddleware.verificarToken, authMiddleware.verificarMesmoUsuario, authController.deletar);

/**
 * @swagger
 * /api/auth:
 *   get:
 *     summary: Lista usuarios
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Lista de usuarios.
 *       401:
 *         description: Token ausente, invalido ou expirado.
 */
router.get('/', authMiddleware.verificarToken, authController.listarTodosUsuarios);

/**
 * @swagger
 * /api/auth/{id}:
 *   patch:
 *     summary: Atualiza o usuario autenticado
 *     tags: [Autenticacao]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID do usuario. Deve coincidir com o token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *                 example: joao
 *               senha:
 *                 type: string
 *                 example: nova-senha
 *               status:
 *                 type: string
 *                 example: ativo
 *     responses:
 *       201:
 *         description: Usuario atualizado.
 *       403:
 *         description: Token e ID nao coincidem.
 */
router.patch('/:id', authMiddleware.verificarToken, authMiddleware.verificarMesmoUsuario, authController.atualizarUsuario);

module.exports = router;
