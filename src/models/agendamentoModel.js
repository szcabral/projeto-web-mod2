const Joi = require("joi");
const db = require("../config/database");

const agendamentoSchema = Joi.object({
  tipo: Joi.string().max(100).required(),
  disponivel: Joi.boolean().default(true),
  horario: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  data: Joi.date().iso().required(),
  funcionario_id: Joi.number().integer().positive().required(),
  evento_id: Joi.number().integer().positive().allow(null),
});

class Agendamento {
  static async create(agendamentoData) {
    const { error } = agendamentoSchema.validate(agendamentoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { tipo, disponivel, horario, data, funcionario_id, evento_id } = agendamentoData;
    const result = await db.query(
      "INSERT INTO agendamentos (tipo, disponivel, horario, data, funcionario_id, evento_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [tipo, disponivel, horario, data, funcionario_id, evento_id]
    );
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT a.*, f.nome as funcionario_nome, e.titulo as evento_titulo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      LEFT JOIN eventos e ON a.evento_id = e.id
      ORDER BY a.data DESC, a.horario
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `
      SELECT a.*, f.nome as funcionario_nome, e.titulo as evento_titulo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      LEFT JOIN eventos e ON a.evento_id = e.id
      WHERE a.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async getAvailable(data = null) {
    let query = `
      SELECT a.*, f.nome as funcionario_nome
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      WHERE a.disponivel = true
    `;
    const params = [];

    if (data) {
      query += " AND a.data = $1";
      params.push(data);
    }

    query += " ORDER BY a.data, a.horario";

    const result = await db.query(query, params);
    return result.rows;
  }

  static async update(id, agendamentoData) {
    const { error } = agendamentoSchema.validate(agendamentoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { tipo, disponivel, horario, data, evento_id } = agendamentoData;
    const result = await db.query(
      "UPDATE agendamentos SET tipo = $1, disponivel = $2, horario = $3, data = $4, evento_id = $5 WHERE id = $6 RETURNING *",
      [tipo, disponivel, horario, data, evento_id, id]
    );
    return result.rows[0];
  }

  static async markUnavailable(id, eventoId) {
    const result = await db.query(
      "UPDATE agendamentos SET disponivel = false, evento_id = $2 WHERE id = $1 RETURNING *",
      [id, eventoId]
    );
    return result.rows[0];
  }

  static async releaseTime(id) {
    const result = await db.query(
      "UPDATE agendamentos SET disponivel = true, evento_id = NULL WHERE id = $1 RETURNING *",
      [id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM agendamentos WHERE id = $1", [id]);
  }
}

module.exports = Agendamento;
