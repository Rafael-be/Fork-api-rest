const jwt = require('jsonwebtoken');
const md5 = require('md5');
const Usuario = require('../models/usuarioModel');

/**
 * Cria um token JWT para o usuário autenticado.
 * @param {number} id - ID do cliente.
 * @returns {string} Token JWT com validade de 1 dia.
 */
const criarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

/**
 * Realiza o login do usuário.
 * Verifica as credenciais e retorna um token JWT em caso de sucesso.
 *
 * @async
 * @param {import('express').Request} req - Requisição Express.
 * @param {Object} req.body - Corpo da requisição.
 * @param {string} [req.body.usuario] - Nome do usuário (alternativa a `nome`).
 * @param {string} [req.body.nome] - Nome do usuário (alternativa a `usuario`).
 * @param {string} req.body.senha - Senha do usuário.
 * @param {import('express').Response} res - Resposta Express.
 * @returns {Promise<void>}
 *
 * @example
 * // POST /api/auth/login
 * // Body: { "usuario": "joao", "senha": "123456" }
 * // Retorno 200: { status: 'success', token: '...', informacoes: { ... } }
 * // Retorno 400: { message: 'Por favor, informe usuario e senha para logar' }
 * // Retorno 401: { message: 'Usuario ou senha incorretos' }
 */
exports.login = async (req, res) => {
  try {
    const { usuario, nome, senha } = req.body;
    const nomeUsuario = usuario || nome;

    if (!nomeUsuario || !senha) {
      return res.status(400).json({ message: 'Por favor, informe usuario e senha para logar' });
    }

    const usuarioEncontrado = await Usuario.findByNome(nomeUsuario);

    if (!usuarioEncontrado || !usuarioEncontrado.senha) {
      return res.status(401).json({ message: 'Usuario ou senha incorretos' });
    }

    const senhaHash = md5(senha);
    const senhaCorreta = (senhaHash === usuarioEncontrado.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Usuario ou senha incorretos' });
    }

    const token = criarToken(usuarioEncontrado.id_cliente);

    res.status(200).json({
      status: 'success',
      token,
      informacoes: {
        id_cliente: usuarioEncontrado.id_cliente,
        nome: usuarioEncontrado.nome,
        status: usuarioEncontrado.status
      }
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};