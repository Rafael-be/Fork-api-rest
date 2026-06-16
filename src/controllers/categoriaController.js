const Categoria = require('../models/categoriaModel');

const verificarPermissaoEstrita = (req) => {
  if (!req.user || !req.user.id_usuario) {
    const erro = new Error('Acesso negado. ID do usuário não validado no token.');
    erro.statusCode = 403; // 403 Forbidden conforme exigido
    throw erro;
  }
};

exports.listarCategorias = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const categorias = await Categoria.listarTodas();
    res.status(200).json({ status: 'success', resultados: categorias.length, data: categorias });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.buscarCategoria = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const categoria = await Categoria.buscarPorId(req.params.id);
    
    if (!categoria) return res.status(404).json({ message: 'Categoria não encontrada' });
    
    res.status(200).json({ status: 'success', data: categoria });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.criarCategoria = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const { nome } = req.body;
    
    if (!nome) return res.status(400).json({ message: 'O nome da categoria é obrigatório' });

    const idGerado = await Categoria.criar(nome);
    res.status(201).json({ status: 'success', message: 'Categoria criada', id_categoria: idGerado });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.atualizarCategoria = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const { nome } = req.body;
    
    if (!nome) return res.status(400).json({ message: 'O nome da categoria é obrigatório' });

    const linhasAfetadas = await Categoria.atualizar(req.params.id, nome);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Categoria não encontrada' });

    res.status(200).json({ status: 'success', message: 'Categoria atualizada com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.deletarCategoria = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    
    const linhasAfetadas = await Categoria.deletar(req.params.id);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Categoria não encontrada' });

    res.status(200).json({ status: 'success', message: 'Categoria removida com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};