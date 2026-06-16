const pool = require('../../config/database');

const CategoriaModel = {
  listarTodas: async () => {
    const [linhas] = await pool.query('SELECT * FROM categorias');
    return linhas;
  },

  buscarPorId: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM categorias WHERE id_categoria = ?', [id]);
    return linhas[0];
  },

  criar: async (nome) => {
    const [resultado] = await pool.query('INSERT INTO categorias (nome) VALUES (?)', [nome]);
    return resultado.insertId; // Retorna o ID gerado pelo MySQL
  },

  atualizar: async (id, nome) => {
    const [resultado] = await pool.query('UPDATE categorias SET nome = ? WHERE id_categoria = ?', [nome, id]);
    return resultado.affectedRows; // Retorna quantas linhas foram alteradas
  },

  deletar: async (id) => {
    const [resultado] = await pool.query('DELETE FROM categorias WHERE id_categoria = ?', [id]);
    return resultado.affectedRows;
  }
};

module.exports = CategoriaModel;