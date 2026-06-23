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


const verificarPermissaoEstrita = (req) => {
  if (!req.user || !req.user.id_usuario) {
    const erro = new Error('Acesso negado. ID do usuário não validado no token.');
    erro.statusCode = 403; // 403 Forbidden conforme exigido
    throw erro;
  }
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



exports.cadastro = async (req, res) => {
  try {
    console.log(req.body);
    const { nome, senha, status } = req.body;

    if (!nome || !senha) { 
      return res.status(400).json({ message: 'Por favor, informe nome e senha para cadastro' });
    }

    const usuarioExistente = await Usuario.findByNome(nome);

    if (usuarioExistente) {
      return res.status(400).json({ message: `O usuario ${nome} já existe` });
    }

    const senhaHash = md5(senha);
    const novoUsuario = await Usuario.create({ nome, senha: senhaHash, status });

    const novoToken = criarToken(novoUsuario.id);

    res.status(201).json({
      status: 'success',
      informacoes: {
        id_cliente: novoUsuario.id,
        nome: novoUsuario.nome,
        token: novoToken
      }
    });

  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};



exports.deletar = async (req, res) => {
  try{
    verificarPermissaoEstrita(req);
      await Usuario.deletar(req.params.id);
      res.status(201).json({
        status: 'Success',
        message: `Usuário ${req.user.nome} foi deletado`
      });
  }catch(err){
    res.status(500).json({ status: 'error', message: err.message });
  }
}



exports.listarTodosUsuarios = async (req, res) => {
  try{
    verificarPermissaoEstrita(req);
    const usuarios = await Usuario.listarTodos();
    res.status(201).json({
      message: 'Lista de usuários:',
      resultados: usuarios.length,
      data: usuarios
    });
  
  }catch(err){
    res.status(500).json({ status: 'error', message: err.message });
  }
}



exports.alterarUsuario = async(req, res) => {
  try{
    verificarPermissaoEstrita(req);
    const dados = req.body;
    const id = req.params.id;

    const usuarioAtualizado = await Usuario.atualizar(id, dados);
    
    res.status(201).json({
      message: 'Alteração concluída com sucesso',
      data: usuarioAtualizado
    })


  }catch(err){
    res.status(500).json({ status: 'error', message: err.message });
  }
}