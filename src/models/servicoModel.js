const Joi = require("joi");
const db = require("../config/database");

const servicoSchema = Joi.object({
  tipo: Joi.string().max(100).required(),
  custo: Joi.number().positive().precision(2).required(),
});

class Servico {
  static async create(servicoData) {
    const { error } = servicoSchema.validate(servicoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { tipo, custo } = servicoData;
    const result = await db.query(
      "INSERT INTO servicos (tipo, custo) VALUES ($1, $2) RETURNING *",
      [tipo, custo]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT * FROM servicos ORDER BY tipo");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT * FROM servicos WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async update(id, servicoData) {
    const { error } = servicoSchema.validate(servicoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { tipo, custo } = servicoData;
    const result = await db.query(
      "UPDATE servicos SET tipo = $1, custo = $2 WHERE id = $3 RETURNING *",
      [tipo, custo, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM servicos WHERE id = $1", [id]);
  }

  static async calcularCustoTotal(servicoIds) {
    const query = `
      SELECT SUM(custo) as total 
      FROM servicos 
      WHERE id = ANY($1)
    `;
    const result = await db.query(query, [servicoIds]);
    return parseFloat(result.rows[0].total) || 0;
  }
}

module.exports = Servico;