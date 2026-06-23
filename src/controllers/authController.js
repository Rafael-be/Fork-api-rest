const jwt = require('jsonwebtoken');
const md5 = require('md5');
const Usuario = require('../models/usuarioModel');

const criarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

const verificarPermissaoEstrita = (req) => {
  if (!req.user || !req.user.id_usuario) {
    const erro = new Error('Acesso negado. ID do usuario nao validado no token.');
    erro.statusCode = 403;
    throw erro;
  }
};

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

    const senhaCorreta = md5(senha) === usuarioEncontrado.senha;

    if (!senhaCorreta) {
      return res.status(401).json({ message: 'Usuario ou senha incorretos' });
    }

    const token = criarToken(usuarioEncontrado.id_usuario);

    res.status(200).json({
      status: 'success',
      token,
      informacoes: {
        id_usuario: usuarioEncontrado.id_usuario,
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
    const { nome, senha, status } = req.body;

    if (!nome || !senha) {
      return res.status(400).json({ message: 'Por favor, informe nome e senha para cadastro' });
    }

    const usuarioExistente = await Usuario.findByNome(nome);

    if (usuarioExistente) {
      return res.status(400).json({ message: `O usuario ${nome} ja existe` });
    }

    const novoUsuario = await Usuario.create({ nome, senha: md5(senha), status });
    const novoToken = criarToken(novoUsuario.id);

    res.status(201).json({
      status: 'success',
      informacoes: {
        id_usuario: novoUsuario.id,
        nome: novoUsuario.nome,
        token: novoToken
      }
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.deletar = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const linhasAfetadas = await Usuario.deletar(req.params.id);

    if (linhasAfetadas === 0) {
      return res.status(404).json({ message: 'Usuario nao encontrado' });
    }

    res.status(201).json({
      status: 'Success',
      message: `Usuario ${req.user.nome} foi deletado`
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.listarTodosUsuarios = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const usuarios = await Usuario.listarTodos();

    res.status(201).json({
      message: 'Lista de usuarios:',
      resultados: usuarios.length,
      data: usuarios
    });
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};

exports.atualizarUsuario = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dados = { ...req.body };

    if (dados.senha !== undefined) {
      dados.senha = md5(dados.senha);
    }

    const usuarioAtualizado = await Usuario.atualizar(req.params.id, dados);

    res.status(201).json({
      message: 'Alteracao concluida com sucesso',
      data: usuarioAtualizado
    });
  } catch (err) {
    res.status(err.statusCode || 500).json({ status: 'error', message: err.message });
  }
};
