const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

exports.verificarToken = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Voce nao esta logado! Token ausente.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const usuarioAtual = await Usuario.findById(decoded.id);

    if (!usuarioAtual) {
      return res.status(401).json({ message: 'O usuario deste token nao existe mais.' });
    }

    req.user = {
      id_usuario: usuarioAtual.id_usuario,
      nome: usuarioAtual.nome
    };

    next();
  } catch (err) {
    res.status(401).json({ message: 'Token invalido ou expirado.' });
  }
};

exports.verificarMesmoUsuario = (req, res, next) => {
  if (req.params.id && req.user.id_usuario != req.params.id) {
    return res.status(403).json({ message: 'Token e id nao coincidem ao mesmo usuario' });
  }

  next();
};
