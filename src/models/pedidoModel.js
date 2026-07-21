const pool = require('../../config/database');

/**
 * @typedef {Object} Pedido
 * @property {number} id_pedido ID auto incrementavel do pedido.
 * @property {string} data Data e hora do pedido em formato DATETIME.
 * @property {number} clientes_id_cliente ID do cliente relacionado.
 * @property {PedidoProduto[]} produtos Produtos relacionados ao pedido.
 */

/**
 * @typedef {Object} PedidoProduto
 * @property {number} produtos_id_produto ID do produto relacionado.
 * @property {number} quantidade Quantidade solicitada.
 * @property {number} valor_unitario Valor do produto no momento do pedido.
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
    const [pedidos] = await pool.query('SELECT * FROM pedidos');
    return Promise.all(pedidos.map(async (pedido) => ({
      ...pedido,
      produtos: await PedidoModel.listarProdutosDoPedido(pedido.id_pedido)
    })));
  },

  /**
   * Busca um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @returns {Promise<Pedido|undefined>} Pedido encontrado.
   */
  buscarPorId: async (id) => {
    const [linhas] = await pool.query('SELECT * FROM pedidos WHERE id_pedido = ?', [id]);
    if (!linhas[0]) return undefined;

    return {
      ...linhas[0],
      produtos: await PedidoModel.listarProdutosDoPedido(id)
    };
  },

  /**
   * Insere um pedido.
   * @param {Omit<Pedido, 'id_pedido'>} pedido Dados do pedido.
   * @returns {Promise<number>} ID gerado.
   */
  criar: async ({ data, clientes_id_cliente, produtos }) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const sqlPedido = 'INSERT INTO pedidos (data, clientes_id_cliente) VALUES (?, ?)';
      const [resultado] = await connection.query(sqlPedido, [data, clientes_id_cliente]);
      const idPedido = resultado.insertId;

      await PedidoModel.salvarProdutosDoPedido(connection, idPedido, produtos);

      await connection.commit();
      return idPedido;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Atualiza um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @param {Omit<Pedido, 'id_pedido'>} pedido Dados atualizados.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  atualizar: async (id, { data, clientes_id_cliente, produtos }) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      const [pedidosEncontrados] = await connection.query(
        'SELECT id_pedido FROM pedidos WHERE id_pedido = ? FOR UPDATE',
        [id]
      );

      if (!pedidosEncontrados[0]) {
        await connection.rollback();
        return 0;
      }

      const sql = 'UPDATE pedidos SET data = ?, clientes_id_cliente = ? WHERE id_pedido = ?';
      await connection.query(sql, [data, clientes_id_cliente, id]);

      await PedidoModel.restaurarEstoqueDoPedido(connection, id);
      await connection.query('DELETE FROM pedidos_produtos WHERE pedidos_id_pedido = ?', [id]);
      await PedidoModel.salvarProdutosDoPedido(connection, id, produtos);

      await connection.commit();
      return 1;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  /**
   * Remove um pedido por ID.
   * @param {number|string} id ID do pedido.
   * @returns {Promise<number>} Quantidade de linhas afetadas.
   */
  deletar: async (id) => {
    const connection = await pool.getConnection();

    try {
      await connection.beginTransaction();

      await PedidoModel.restaurarEstoqueDoPedido(connection, id);
      await connection.query('DELETE FROM pedidos_produtos WHERE pedidos_id_pedido = ?', [id]);
      const [resultado] = await connection.query('DELETE FROM pedidos WHERE id_pedido = ?', [id]);

      await connection.commit();
      return resultado.affectedRows;
    } catch (err) {
      await connection.rollback();
      throw err;
    } finally {
      connection.release();
    }
  },

  listarProdutosDoPedido: async (idPedido) => {
    const sql = `
      SELECT
        pp.produtos_id_produto,
        p.nome,
        pp.quantidade,
        pp.valor_unitario,
        (pp.quantidade * pp.valor_unitario) AS valor_total
      FROM pedidos_produtos pp
      INNER JOIN produtos p ON p.id_produto = pp.produtos_id_produto
      WHERE pp.pedidos_id_pedido = ?
    `;
    const [linhas] = await pool.query(sql, [idPedido]);
    return linhas;
  },

  salvarProdutosDoPedido: async (connection, idPedido, produtos) => {
    for (const item of produtos) {
      const [produtosEncontrados] = await connection.query(
        'SELECT id_produto, valor, estoque FROM produtos WHERE id_produto = ? FOR UPDATE',
        [item.produtos_id_produto]
      );
      const produto = produtosEncontrados[0];

      if (!produto) {
        const erro = new Error(`Produto ${item.produtos_id_produto} nao encontrado`);
        erro.statusCode = 404;
        throw erro;
      }

      if (produto.estoque < item.quantidade) {
        const erro = new Error(`Estoque insuficiente para o produto ${item.produtos_id_produto}. Disponivel: ${produto.estoque}`);
        erro.statusCode = 400;
        throw erro;
      }

      await connection.query(
        `INSERT INTO pedidos_produtos
          (pedidos_id_pedido, produtos_id_produto, quantidade, valor_unitario)
         VALUES (?, ?, ?, ?)`,
        [idPedido, item.produtos_id_produto, item.quantidade, produto.valor]
      );

      await connection.query(
        'UPDATE produtos SET estoque = estoque - ? WHERE id_produto = ?',
        [item.quantidade, item.produtos_id_produto]
      );
    }
  },

  restaurarEstoqueDoPedido: async (connection, idPedido) => {
    const [itens] = await connection.query(
      'SELECT produtos_id_produto, quantidade FROM pedidos_produtos WHERE pedidos_id_pedido = ?',
      [idPedido]
    );

    for (const item of itens) {
      await connection.query(
        'UPDATE produtos SET estoque = estoque + ? WHERE id_produto = ?',
        [item.quantidade, item.produtos_id_produto]
      );
    }
  }
};

module.exports = PedidoModel;
