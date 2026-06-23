const express = require('express');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: API
 *   description: Rotas publicas de informacao da API.
 */

/**
 * @swagger
 * /api/status:
 *   get:
 *     summary: Consulta o status da API
 *     tags: [API]
 *     responses:
 *       200:
 *         description: API online.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 versao:
 *                   type: string
 *                   example: 2.0.0
 *                 status:
 *                   type: string
 *                   example: online
 *                 banco:
 *                   type: string
 *                   example: MySQL
 */
router.get('/status', (req, res) => {
  res.status(200).json({
    versao: "2.0.0",
    status: "online",
    banco: "MySQL"
  });
});

module.exports = router;
