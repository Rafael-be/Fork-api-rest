const pool = require('../../config/database');

/**
 * @typedef {Object} Usuario
 * @property {number} id_cliente - ID do cliente
 * @property {string} nome - Nome do usuário
 * @property {string} senha - Senha hash MD5
 * @property {string} status - Status do usuário
 */

/**
 * Modelo de acesso aos dados de usuários na tabela `clientes`.
 */
const UsuarioModel = {
  /**
   * Busca um usuário pelo nome.
   * @async
   * @param {string} nome - Nome do usuário a ser buscado.
   * @returns {Promise<Usuario|undefined>} O usuário encontrado ou undefined.
   */
  findByNome: async (nome) => {
    const sql = 'SELECT * FROM clientes WHERE nome = ?';
    const [linhas] = await pool.execute(sql, [nome]);
    return linhas[0];
  },

  /**
   * Busca um usuário pelo ID.
   * @async
   * @param {number} id - ID do cliente.
   * @returns {Promise<Usuario|undefined>} O usuário encontrado ou undefined.
   */
  findById: async (id) => {
    const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
    const [linhas] = await pool.execute(sql, [id]);
    return linhas[0];
  }
};

module.exports = UsuarioModel;