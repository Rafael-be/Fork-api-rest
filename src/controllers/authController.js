const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

const criarToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
};

exports.login = async (req, res) => {
  try {
    const { nome, telefone } = req.body;
    
    if (!nome || !telefone) {
      return res.status(400).json({ message: 'Por favor, informe nome e telefone para logar' });
    }

    const usuario = await Usuario.findByNome(nome);
    
    if (!usuario || usuario.telefone !== telefone) {
      return res.status(401).json({ message: 'Nome ou telefone incorretos' });
    }

    const token = criarToken(usuario.id_cliente);

    res.status(200).json({
      status: 'success',
      token,
      informacoes: { 
        id_cliente: usuario.id_cliente,
        nome: usuario.nome,
        status: usuario.status
      }
    });
    
  } catch (err) {
    res.status(500).json({ status: 'error', message: err.message });
  }
};