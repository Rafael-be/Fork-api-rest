const pool = require('../../config/database');

/**
 * @typedef {Object} Pedido
 * @property {number} id_pedido ID auto incrementavel do pedido.
 * @property {string} data Data e hora do pedido em formato DATETIME.
 * @property {number} clientes_id_cliente ID do cliente relacionado.
 */

/**
 * Modelo de acesso a dados da tabela `pedidos`.
 */
const PedidoModel = {
  /**
   * Lista todos os pedidos.
   * @returns {Promise<Pedido[]>} Pedidos cadastrados.
   */
  listarTodos: async () => {
    const [linhas] = await pool.query('SELECT * FROM pedidos');
    return linhas;
  },

  /**
   * Busca um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @returns {Promise<Pedido|undefined>} Pedido encontrado.
   */
  buscarPorId: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    return linhas[0];
  },

  /**
   * Insere um pedido.
   * @param {Omit<Pedido, 'id_pedido'>} pedido Dados do pedido.
   * @returns {Promise<number>} ID gerado.
   */
  criar: async ({ data, clientes_id_cliente }) => {
    const sql = 'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)';
    const [resultado] = await pool.query(sql, [data, clientes_id_cliente]);
    return resultado.insertId;
  },

  /**
   * Atualiza um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @param {Omit<Pedido, 'id_pedido'>} pedido Dados atualizados.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  atualizar: async (id, { data, clientes_id_cliente }) => {
    const sql = 'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?';
    const [resultado] = await pool.query(sql, [data, clientes_id_cliente, id]);
    return resultado.affectedRows;
  },

  /**
   * Remove um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  deletar: async (id) => {
    const [resultado] = await pool.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);
    return resultado.affectedRows;
  }
};

module.exports = PedidoModel;
