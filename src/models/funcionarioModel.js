const Joi = require("joi");
const db = require("../config/database");

const funcionarioSchema = Joi.object({
  nome: Joi.string().min(3).max(100).required(),
  cargo: Joi.string().max(50).allow(null, ""),
  senha: Joi.string().min(6).required(),
});

class Funcionario {
  static async create(funcionarioData) {
    const { error } = funcionarioSchema.validate(funcionarioData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { nome, cargo, senha } = funcionarioData;
    const result = await db.query(
      "INSERT INTO funcionarios (nome, cargo, senha) VALUES ($1, $2, $3) RETURNING *",
      [nome, cargo, senha]
    );
    return result.rows[0];
  }

  static async getAll() {
    const result = await db.query("SELECT id, nome, cargo FROM funcionarios ORDER BY nome");
    return result.rows;
  }

  static async getById(id) {
    const result = await db.query("SELECT id, nome, cargo FROM funcionarios WHERE id = $1", [id]);
    return result.rows[0];
  }

  static async update(id, funcionarioData) {
    const { error } = funcionarioSchema.validate(funcionarioData);
    if (error) {
      throw new Error(error.details[0].message);
    }
    const { nome, cargo, senha } = funcionarioData;
    const result = await db.query(
      "UPDATE funcionarios SET nome = $1, cargo = $2, senha = $3 WHERE id = $4 RETURNING *",
      [nome, cargo, senha, id]
    );
    return result.rows[0];
  }

  static async delete(id) {
    await db.query("DELETE FROM funcionarios WHERE id = $1", [id]);
  }

  static async buscarEventos(funcionarioId) {
    const query = `
      SELECT e.*, c.nome as cliente_nome
      FROM eventos e
      JOIN evento_funcionario ef ON e.id = ef.evento_id
      JOIN clientes c ON e.cliente_id = c.id
      WHERE ef.funcionario_id = $1
      ORDER BY e.data DESC
    `;
    const result = await db.query(query, [funcionarioId]);
    return result.rows;
  }

  static async buscarAgendamentos(funcionarioId) {
    const query = `
      SELECT a.*, e.titulo as evento_titulo
      FROM agendamentos a
      LEFT JOIN eventos e ON a.evento_id = e.id
      WHERE a.funcionario_id = $1
      ORDER BY a.data DESC, a.horario
    `;
    const result = await db.query(query, [funcionarioId]);
    return result.rows;
  }

  static async verificarDisponibilidade(funcionarioId, data, horario) {
    const query = `
      SELECT * FROM agendamentos 
      WHERE funcionario_id = $1 AND data = $2 AND horario = $3 AND disponivel = false
    `;
    const result = await db.query(query, [funcionarioId, data, horario]);
    return result.rows.length === 0;
  }
}

module.exports = Funcionario;
