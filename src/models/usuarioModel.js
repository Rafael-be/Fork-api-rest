const pool = require('../../config/database');

const UsuarioModel = {
  findByNome: async (nome) => {
    const sql = 'SELECT * FROM usuarios WHERE LOWER(nome) = LOWER(?)';
    const [linhas] = await pool.execute(sql, [nome]);
    return linhas[0];
  },

  findById: async (id) => {
    const sql = 'SELECT * FROM usuarios WHERE id_usuario = ?';
    const [linhas] = await pool.execute(sql, [id]);
    return linhas[0];
  },

  create: async ({ nome, senha, status }) => {
    const sql = 'INSERT INTO usuarios (nome, senha, status) VALUES (?, ?, ?);';
    const [resultado] = await pool.execute(sql, [nome, senha, status]);
    return { id: resultado.insertId, nome };
  },

  deletar: async (id) => {
    const sql = 'DELETE FROM usuarios WHERE id_usuario = ?;';
    const [resultado] = await pool.execute(sql, [id]);
    return resultado.affectedRows;
  },

  listarTodos: async () => {
    const sql = 'SELECT id_usuario, nome, status FROM usuarios;';
    const [linhas] = await pool.execute(sql);
    return linhas;
  },

  atualizar: async (id_usuario, dados) => {
    const campos = [];
    const valores = [];

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

    if (campos.length === 0) {
      const erro = new Error('Voce deve por um campo para ser atualizado');
      erro.statusCode = 400;
      throw erro;
    }

    valores.push(id_usuario);
    const parametros = campos.join(', ');

    const sql = `UPDATE usuarios SET ${parametros} WHERE id_usuario = ?;`;
    const [resultado] = await pool.execute(sql, valores);
    return resultado;
  }
};

module.exports = UsuarioModel;
