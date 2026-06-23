const express = require('express');
const router = express.Router();
const clienteController = require('../controllers/clienteController');
const autenticacaoMiddleware = require('../middlewares/autenticacaoMiddleware');

router.use(autenticacaoMiddleware.verificarToken);

router.get('/', clienteController.listarClientes);
router.get('/:id', clienteController.buscarCliente);
router.post('/', clienteController.criarCliente);
router.patch('/:id', clienteController.atualizarCliente);
router.delete('/:id', clienteController.deletarCliente);

module.exports = router;
