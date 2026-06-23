const pool = require('../../config/database');

const ClienteModel = {
  listarTodos: async () => {
    const [linhas] = await pool.query('SELECT * FROM clientes');
    return linhas;
  },

  buscarPorId: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    return linhas[0];
  },

  criar: async ({ nome, usuarios_id_usuario }) => {
    const sql = 'INSERT INTO clientes (nome, usuarios_id_usuario) VALUES (?, ?)';
    const [resultado] = await pool.query(sql, [nome, usuarios_id_usuario]);
    return resultado.insertId;
  },

  atualizar: async (id, { nome, usuarios_id_usuario }) => {
    const sql = 'UPDATE clientes SET nome = ?, usuarios_id_usuario = ? WHERE id_cliente = ?';
    const [resultado] = await pool.query(sql, [nome, usuarios_id_usuario, id]);
    return resultado.affectedRows;
  },

  deletar: async (id) => {
    const [resultado] = await pool.query('DELETE FROM clientes WHERE id_cliente = ?', [id]);
    return resultado.affectedRows;
  }
};

module.exports = ClienteModel;
