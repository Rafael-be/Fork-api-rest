const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuarioModel');

/**
 * Valida o token JWT enviado no header Authorization e autentica a requisição.
 *
 * Espera o formato `Authorization: Bearer <token>`. Quando o token é válido e o
 * usuário ainda existe no banco, adiciona o documento do usuário em `req.user`
 * para que os próximos middlewares/controllers possam aplicar regras de permissão.
 *
 * @param {Request} req Requisição HTTP.
 * @param {Response} res Resposta HTTP.
 * @param {NextFunction} next Próximo middleware da cadeia.
 * @returns {Promise<void>}
 */
exports.verificarToken = async (req, res, next) => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({ message: 'Você não está logado! Token ausente.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const usuarioAtual = await Usuario.findById(decoded.id);

    if (!usuarioAtual) {
      return res.status(401).json({ message: 'O usuário deste token não existe mais.' });
    }
    
    if(req.params.id && usuarioAtual.id_cliente != req.params.id){
      return res.status(403).json({ message: 'Token e id nao coinscidem ao mesmo usuário'});
    }

    req.user = {
      id_usuario: usuarioAtual.id_cliente, 
      nome: usuarioAtual.nome
    };
    
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};