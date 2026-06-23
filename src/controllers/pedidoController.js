const Pedido = require('../models/pedidoModel');

/**
 * Valida se a requisicao autenticada possui usuario no token.
 * @param {import('express').Request} req Requisicao Express.
 * @throws {Error} Quando o token nao gerou um usuario valido.
 */
const verificarPermissaoEstrita = (req) => {
  if (!req.user || !req.user.id_usuario) {
    const erro = new Error('Acesso negado. ID do usuario nao validado no token.');
    erro.statusCode = 403;
    throw erro;
  }
};

/**
 * Converte o campo amigavel `id_cliente` para o nome da FK usado no banco.
 * @param {Object} body Corpo da requisicao.
 * @param {string} body.data Data e hora do pedido.
 * @param {number} [body.id_cliente] ID do cliente enviado pela API.
 * @param {number} [body.clientes_id_cliente] Nome real da FK no banco.
 * @returns {{data: string, clientes_id_cliente: number}}
 */
const normalizarDadosPedido = (body) => {
  const idCliente = body.id_cliente ?? body.clientes_id_cliente;

  return {
    data: body.data,
    clientes_id_cliente: idCliente
  };
};

/**
 * Verifica se os campos obrigatorios do pedido foram informados.
 * @param {Object} pedido Dados do pedido.
 * @returns {boolean} True quando os campos obrigatorios existem.
 */
const camposObrigatoriosPresentes = ({ data, clientes_id_cliente }) => {
  return data !== undefined && clientes_id_cliente !== undefined;
};

/**
 * Lista todos os pedidos cadastrados.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.listarPedidos = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const pedidos = await Pedido.listarTodos();
    res.status(200).json({ status: 'success', resultados: pedidos.length, data: pedidos });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Busca um pedido pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.buscarPedido = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const pedido = await Pedido.buscarPorId(req.params.id);

    if (!pedido) return res.status(404).json({ message: 'Pedido nao encontrado' });

    res.status(200).json({ status: 'success', data: pedido });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Cria um pedido.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.criarPedido = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosPedido = normalizarDadosPedido(req.body);

    if (!camposObrigatoriosPresentes(dadosPedido)) {
      return res.status(400).json({ message: 'Informe data e id_cliente' });
    }

    const idGerado = await Pedido.criar(dadosPedido);
    res.status(201).json({ status: 'success', message: 'Pedido criado', id_pedido: idGerado });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Atualiza um pedido pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.atualizarPedido = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosPedido = normalizarDadosPedido(req.body);

    if (!camposObrigatoriosPresentes(dadosPedido)) {
      return res.status(400).json({ message: 'Informe data e id_cliente' });
    }

    const linhasAfetadas = await Pedido.atualizar(req.params.id, dadosPedido);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Pedido nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Pedido atualizado com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Remove um pedido pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.deletarPedido = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);

    const linhasAfetadas = await Pedido.deletar(req.params.id);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Pedido nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Pedido removido com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
