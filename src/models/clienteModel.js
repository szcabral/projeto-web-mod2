const Joi = require("joi");
const db = require("../config/database");

const clienteSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  email: Joi.string().email().max(100).required(),
  telefone: Joi.string().max(20).allow(null, ""),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$/).max(14).required(),
  senha: Joi.string().min(6).required(),
});

class Cliente {
  static async create(clienteData) {
    const { error } = clienteSchema.validate(clienteData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { nome, email, telefone, cpf, senha } = clienteData;
    const result = await db.query(
      "INSERT INTO clientes (nome, email, telefone, cpf, senha) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [nome, email, telefone, cpf, senha]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM clientes");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM clientes WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async update(id, clienteData) {
    const { error } = clienteSchema.validate(clienteData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { nome, email, telefone, cpf, senha } = clienteData;
    const result = await db.query(
      "UPDATE clientes SET nome = $1, email = $2, telefone = $3, cpf = $4, senha = $5 WHERE id = $6 RETURNING *",
      [nome, email, telefone, cpf, senha, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM clientes WHERE id = $1", [id]);
  }
}

module.exports = Cliente;