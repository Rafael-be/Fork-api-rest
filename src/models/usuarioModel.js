const pool = require('../../config/database');

const UsuarioModel = {
  findByNome: async (nome) => {
    const [linhas] = await pool.query('SELECT * FROM clientes WHERE nome = ?', [nome]);
    return linhas[0]; 
  },

  findById: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return linhas[0];
  }
};

module.exports = UsuarioModel;