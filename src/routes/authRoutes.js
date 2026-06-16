const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

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
 *               nome:
 *                 type: string
 *                 example: "João da Silva"
 *               telefone:
 *                 type: string
 *                 example: "11999999999"
 *     responses:
 *       200:
 *         description: Login bem-sucedido.
 */
router.post('/login', authController.login);

module.exports = router;