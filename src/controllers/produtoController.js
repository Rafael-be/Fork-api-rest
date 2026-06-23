const Produto = require('../models/produtoModel');

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
 * Converte o campo amigavel `id_categoria` para o nome da FK usado no banco.
 * @param {Object} body Corpo da requisicao.
 * @param {string} body.nome Nome do produto.
 * @param {number} body.valor Valor do produto.
 * @param {number} body.estoque Quantidade em estoque.
 * @param {number} [body.id_categoria] ID da categoria enviado pela API.
 * @param {number} [body.categorias_id_categoria] Nome real da FK no banco.
 * @returns {{nome: string, valor: number, estoque: number, categorias_id_categoria: number}}
 */
const normalizarDadosProduto = (body) => {
  const idCategoria = body.id_categoria ?? body.categorias_id_categoria;

  return {
    nome: body.nome,
    valor: body.valor,
    estoque: body.estoque,
    categorias_id_categoria: idCategoria
  };
};

/**
 * Verifica se todos os campos obrigatorios do produto foram informados.
 * @param {Object} produto Produto normalizado.
 * @returns {boolean} True quando todos os campos obrigatorios existem.
 */
const camposObrigatoriosPresentes = ({ nome, valor, estoque, categorias_id_categoria }) => {
  return nome !== undefined
    && valor !== undefined
    && estoque !== undefined
    && categorias_id_categoria !== undefined;
};

/**
 * Lista todos os produtos cadastrados.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.listarProdutos = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const produtos = await Produto.listarTodos();
    res.status(200).json({ status: 'success', resultados: produtos.length, data: produtos });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Busca um produto pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.buscarProduto = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const produto = await Produto.buscarPorId(req.params.id);

    if (!produto) return res.status(404).json({ message: 'Produto nao encontrado' });

    res.status(200).json({ status: 'success', data: produto });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Cria um produto usando `id_categoria` como campo publico da FK.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.criarProduto = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosProduto = normalizarDadosProduto(req.body);

    if (!camposObrigatoriosPresentes(dadosProduto)) {
      return res.status(400).json({
        message: 'Informe nome, valor, estoque e id_categoria'
      });
    }

    const idGerado = await Produto.criar(dadosProduto);
    res.status(201).json({ status: 'success', message: 'Produto criado', id_produto: idGerado });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Atualiza um produto pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.atualizarProduto = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosProduto = normalizarDadosProduto(req.body);

    if (!camposObrigatoriosPresentes(dadosProduto)) {
      return res.status(400).json({
        message: 'Informe nome, valor, estoque e id_categoria'
      });
    }

    const linhasAfetadas = await Produto.atualizar(req.params.id, dadosProduto);

    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Produto nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Produto atualizado com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

/**
 * Remove um produto pelo ID recebido na URL.
 * @param {import('express').Request} req Requisicao Express.
 * @param {import('express').Response} res Resposta Express.
 * @returns {Promise<void>}
 */
exports.deletarProduto = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);

    const linhasAfetadas = await Produto.deletar(req.params.id);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Produto nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Produto removido com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
