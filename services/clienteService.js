const db = require('../config/database');
const bcrypt = require('bcrypt');

class ClienteService {
  static async criar({ nome, email, telefone, cpf, senha }) {
    const clienteExistente = await db.query('SELECT id FROM clientes WHERE email = $1 OR cpf = $2', [email, cpf]);
    if (clienteExistente.rows.length > 0) {
      throw new Error('Cliente já cadastrado com este email ou CPF');
    }

    const query = `
      INSERT INTO clientes (nome, email, telefone, cpf, senha)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;

    const result = await db.query(query, [nome, email, telefone, cpf, senha]);
    return result.rows[0];
  }

  static async buscarTodos() {
    const result = await db.query('SELECT * FROM clientes');
    return result.rows;
  }

  static async buscarPorId(id) {
    const result = await db.query('SELECT * FROM clientes WHERE id = $1', [id]);
    return result.rows[0];
  }

  static async buscarPorEmail(email) {
    const result = await db.query('SELECT * FROM clientes WHERE email = $1', [email]);
    return result.rows[0];
  }

  static async atualizar(id, { nome, email, telefone, cpf }) {
    const query = `
      UPDATE clientes
      SET nome = COALESCE($1, nome),
          email = COALESCE($2, email),
          telefone = COALESCE($3, telefone),
          cpf = COALESCE($4, cpf)
      WHERE id = $5
      RETURNING *
    `;

    const result = await db.query(query, [nome, email, telefone, cpf, id]);
    return result.rows[0];
  }

  static async deletar(id) {
    await db.query('DELETE FROM clientes WHERE id = $1', [id]);
  }
}

module.exports = ClienteService;