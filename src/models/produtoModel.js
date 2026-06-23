const pool = require('../../config/database');

/**
 * @typedef {Object} Produto
 * @property {number} id_produto ID auto incrementavel do produto.
 * @property {string} nome Nome do produto.
 * @property {number} valor Valor do produto.
 * @property {number} estoque Quantidade disponivel.
 * @property {number} categorias_id_categoria ID da categoria relacionada.
 */

/**
 * Modelo de acesso a dados da tabela `produtos`.
 */
const ProdutoModel = {
  /**
   * Lista todos os produtos.
   * @returns {Promise<Produto[]>} Produtos cadastrados.
   */
  listarTodos: async () => {
    const [linhas] = await pool.query('SELECT * FROM produtos');
    return linhas;
  },

  /**
   * Busca um produto por ID.
   * @param {number|string} id ID do produto.
   * @returns {Promise<Produto|undefined>} Produto encontrado.
   */
  buscarPorId: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM produtos WHERE id_produto = ?', [id]);
    return linhas[0];
  },

  /**
   * Insere um produto.
   * @param {Omit<Produto, 'id_produto'>} produto Dados do produto.
   * @returns {Promise<number>} ID gerado.
   */
  criar: async ({ nome, valor, estoque, categorias_id_categoria }) => {
    const sql = `INSERT INTO produtos (nome, valor, estoque, categorias_id_categoria) VALUES (?, ?, ?, ?)`;
    const [resultado] = await pool.query(sql, [nome, valor, estoque, categorias_id_categoria]);
    return resultado.insertId;
  },

  /**
   * Atualiza um produto por ID.
   * @param {number|string} id ID do produto.
   * @param {Omit<Produto, 'id_produto'>} produto Dados atualizados.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  atualizar: async (id, { nome, valor, estoque, categorias_id_categoria }) => {
    const sql = `UPDATE produtos SET nome = ?, valor = ?, estoque = ?, categorias_id_categoria = ? WHERE id_produto = ?`;
    const [resultado] = await pool.query(sql, [nome, valor, estoque, categorias_id_categoria, id]);
    return resultado.affectedRows;
  },

  /**
   * Remove um produto por ID.
   * @param {number|string} id ID do produto.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  deletar: async (id) => {
    const [resultado] = await pool.query('DELETE FROM produtos WHERE id_produto = ?', [id]);
    return resultado.affectedRows;
  }
};

module.exports = ProdutoModel;
