const Joi = require("joi");
const db = require("../config/database");

const eventoSchema = Joi.object({
  titulo: Joi.string().min(3).max(100).required(),
  data: Joi.date().iso().required(),
  horario: Joi.string().pattern(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).required(),
  preco_unitario: Joi.number().positive().precision(2).allow(null),
  cliente_id: Joi.number().integer().positive().required(),
  tipo_evento: Joi.string().max(50).allow(null, ""),
  local: Joi.string().max(255).allow(null, ""),
  numero_convidados: Joi.number().integer().positive().allow(null),
  descricao: Joi.string().max(1000).allow(null, ""),
  observacoes: Joi.string().max(1000).allow(null, ""),
});

class Evento {
  static async create(eventoData) {
    const { error } = eventoSchema.validate(eventoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const {
      titulo,
      data,
      horario,
      preco_unitario,
      cliente_id,
      tipo_evento,
      local,
      numero_convidados,
      descricao,
      observacoes,
    } = eventoData;
    const result = await db.query(
      "INSERT INTO eventos (titulo, data, horario, preco_unitario, cliente_id, tipo_evento, local, numero_convidados, descricao, observacoes) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *",
      [
        titulo,
        data,
        horario,
        preco_unitario,
        cliente_id,
        tipo_evento,
        local,
        numero_convidados,
        descricao,
        observacoes,
      ]
    );
    return result.rows[0];
  }

  static async getAll() {
    const query = `
      SELECT 
        e.id, e.titulo, e.data, e.horario, e.preco_unitario, e.tipo_evento, e.local, e.numero_convidados, e.descricao, e.observacoes,
        c.nome as cliente_nome, c.email as cliente_email
      FROM eventos e
      JOIN clientes c ON e.cliente_id = c.id
      ORDER BY e.data DESC, e.horario DESC
    `;
    const result = await db.query(query);
    return result.rows;
  }

  static async getById(id) {
    const query = `
      SELECT 
        e.id, e.titulo, e.data, e.horario, e.preco_unitario, e.tipo_evento, e.local, e.numero_convidados, e.descricao, e.observacoes,
        c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM eventos e
      JOIN clientes c ON e.cliente_id = c.id
      WHERE e.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  }

  static async update(id, eventoData) {
    const { error } = eventoSchema.validate(eventoData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const {
      titulo,
      data,
      horario,
      preco_unitario,
      cliente_id,
      tipo_evento,
      local,
      numero_convidados,
      descricao,
      observacoes,
    } = eventoData;
    const result = await db.query(
      "UPDATE eventos SET titulo = $1, data = $2, horario = $3, preco_unitario = $4, cliente_id = $5, tipo_evento = $6, local = $7, numero_convidados = $8, descricao = $9, observacoes = $10 WHERE id = $11 RETURNING *",
      [
        titulo,
        data,
        horario,
        preco_unitario,
        cliente_id,
        tipo_evento,
        local,
        numero_convidados,
        descricao,
        observacoes,
        id,
      ]
    );
    return result.rows[0];
  }

  static async delete(id) {
    const client = await db.connect();
    try {
      await client.query("BEGIN");
      await client.query("DELETE FROM evento_funcionario WHERE evento_id = $1", [id]);
      await client.query("DELETE FROM evento_servico WHERE evento_id = $1", [id]);
      await client.query("DELETE FROM agendamentos WHERE evento_id = $1", [id]);
      const result = await client.query("DELETE FROM eventos WHERE id = $1 RETURNING *", [id]);
      await client.query("COMMIT");
      return result.rows[0];
    } catch (err) {
      await client.query("ROLLBACK");
      throw err;
    } finally {
      client.release();
    }
  }
}

module.exports = Evento;