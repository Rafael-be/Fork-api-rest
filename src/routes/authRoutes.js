const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/autenticacaoMiddleware')

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Autentica o usuário no MySQL e gera um Token JWT
 *     tags: [Autenticação]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               usuario:
 *                 type: string
 *                 example: "João da Silva"
 *               senha:
 *                 type: string
 *                 example: "senha_segura"
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 */
router.post('/login', authController.login);

router.post('/cadastro', authController.cadastro);

router.delete('/:id', authMiddleware.verificarToken, authController.deletar);

router.get('/', authMiddleware.verificarToken, authController.listarTodosUsuarios);

router.patch('/a')

module.exports = router;
