const Cliente = require('../models/clienteModel');

const verificarPermissaoEstrita = (req) => {
  if (!req.user || !req.user.id_usuario) {
    const erro = new Error('Acesso negado. ID do usuario nao validado no token.');
    erro.statusCode = 403;
    throw erro;
  }
};

const normalizarDadosCliente = (body) => {
  const idUsuario = body.id_usuario ?? body.usuarios_id_usuario;

  return {
    nome: body.nome,
    usuarios_id_usuario: idUsuario
  };
};

const camposObrigatoriosPresentes = ({ nome, usuarios_id_usuario }) => {
  return nome !== undefined && usuarios_id_usuario !== undefined;
};

exports.listarClientes = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const clientes = await Cliente.listarTodos();
    res.status(200).json({ status: 'success', resultados: clientes.length, data: clientes });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.buscarCliente = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const cliente = await Cliente.buscarPorId(req.params.id);

    if (!cliente) return res.status(404).json({ message: 'Cliente nao encontrado' });

    res.status(200).json({ status: 'success', data: cliente });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.criarCliente = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosCliente = normalizarDadosCliente(req.body);

    if (!camposObrigatoriosPresentes(dadosCliente)) {
      return res.status(400).json({ message: 'Informe nome e id_usuario' });
    }

    const idGerado = await Cliente.criar(dadosCliente);
    res.status(201).json({ status: 'success', message: 'Cliente criado', id_cliente: idGerado });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.atualizarCliente = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);
    const dadosCliente = normalizarDadosCliente(req.body);

    if (!camposObrigatoriosPresentes(dadosCliente)) {
      return res.status(400).json({ message: 'Informe nome e id_usuario' });
    }

    const linhasAfetadas = await Cliente.atualizar(req.params.id, dadosCliente);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Cliente nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Cliente atualizado com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};

exports.deletarCliente = async (req, res) => {
  try {
    verificarPermissaoEstrita(req);

    const linhasAfetadas = await Cliente.deletar(req.params.id);
    if (linhasAfetadas === 0) return res.status(404).json({ message: 'Cliente nao encontrado' });

    res.status(200).json({ status: 'success', message: 'Cliente removido com sucesso' });
  } catch (err) {
    res.status(err.statusCode || 500).json({ message: err.message });
  }
};
