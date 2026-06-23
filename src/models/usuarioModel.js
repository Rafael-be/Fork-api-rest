const pool = require('../../config/database');
const { alterarUsuario } = require('../controllers/authController');

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
    const sql = 'SELECT * FROM clientes WHERE LOWER(nome) = LOWER(?)';
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
  },

  create: async ({nome, senha, status}) => {
    const sql = 'INSERT INTO clientes (nome, senha, status) VALUES (?, ?, ?);';
    const [linhas] = await pool.execute(sql, [nome, senha, status]);
    return { id: linhas.insertId, nome};
  },

  deletar: async (id) => {
    const sql = 'DELETE FROM clientes WHERE (id_cliente = ?);';
    const [linhas] = await pool.execute(sql, [id]);
    return { id: linhas.insertId};
  },

  listarTodos: async () => {
    const sql = 'SELECT id_cliente, nome FROM clientes;';
    const [linhas] = await pool.execute(sql);
    return linhas;
  },

  atualizar: async (id_cliente, dados) => {
    const campos = [];
    const valores = [];
    
    // Como o usuário pode querer alterar apenas um de seus atributos, recebe os dados e se
    // tiver nome, o array campos ganha a parametrização para prevenir sql injection
    if (dados.nome !== undefined) {
      campos.push('nome = ?');
      valores.push(dados.nome);
    }
    if (dados.senha !== undefined) {
      campos.push('senha = ?');
      valores.push(dados.senha);
    }
    if (dados.status !== undefined) {
      campos.push('status = ?');
      valores.push(dados.status);
    }

    if(campos.length === 0){
      const erro = new Error('Você deve pôr um campo para ser atualizado');
      erro.statusCode = 400;
      return erro;
    }

    valores.push(id_cliente);
    const parametros = campos.join(', ');

    const sql = `UPDATE clientes SET ${parametros} WHERE id_cliente = ?;`;
    const [resultado] = await pool.execute(sql, valores);
    return resultado;

  }
};

module.exports = UsuarioModel;