const db = require('../config/database');

const agendamentoService = {
  async listarTodos() {
    const query = `
      SELECT 
        a.id, a.tipo, a.disponivel, a.horario, a.data,
        f.nome as funcionario_nome, f.cargo as funcionario_cargo,
        e.titulo as evento_titulo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      LEFT JOIN eventos e ON a.evento_id = e.id
      ORDER BY a.data DESC, a.horario DESC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  async buscarPorId(id) {
    const query = `
      SELECT 
        a.id, a.tipo, a.disponivel, a.horario, a.data,
        f.nome as funcionario_nome, f.cargo as funcionario_cargo,
        e.titulo as evento_titulo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      LEFT JOIN eventos e ON a.evento_id = e.id
      WHERE a.id = $1
    `;
    const result = await db.query(query, [id]);
    if (result.rows.length === 0) throw new Error('Agendamento não encontrado');
    return result.rows[0];
  },

  async buscarPorFuncionario(funcionarioId) {
    const query = `
      SELECT 
        a.id, a.tipo, a.disponivel, a.horario, a.data,
        e.titulo as evento_titulo
      FROM agendamentos a
      LEFT JOIN eventos e ON a.evento_id = e.id
      WHERE a.funcionario_id = $1
      ORDER BY a.data DESC, a.horario DESC
    `;
    const result = await db.query(query, [funcionarioId]);
    return result.rows;
  },

  async buscarPorEvento(eventoId) {
    const query = `
      SELECT 
        a.id, a.tipo, a.disponivel, a.horario, a.data,
        f.nome as funcionario_nome, f.cargo as funcionario_cargo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      WHERE a.evento_id = $1
      ORDER BY a.data, a.horario
    `;
    const result = await db.query(query, [eventoId]);
    return result.rows;
  },

  async buscarDisponiveis(filtros) {
    const { data, funcionario_id } = filtros;
    let query = `
      SELECT 
        a.id, a.tipo, a.horario, a.data,
        f.nome as funcionario_nome, f.cargo as funcionario_cargo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      WHERE a.disponivel = TRUE
    `;

    const values = [];
    let paramCount = 1;

    if (data) {
      query += ` AND a.data = $${paramCount++}`;
      values.push(data);
    }

    if (funcionario_id) {
      query += ` AND a.funcionario_id = $${paramCount++}`;
      values.push(funcionario_id);
    }

    query += ' ORDER BY a.data, a.horario';

    const result = await db.query(query, values);
    return result.rows;
  },

  async buscarPorData(data) {
    const query = `
      SELECT 
        a.id, a.tipo, a.disponivel, a.horario,
        f.nome as funcionario_nome, f.cargo as funcionario_cargo,
        e.titulo as evento_titulo
      FROM agendamentos a
      JOIN funcionarios f ON a.funcionario_id = f.id
      LEFT JOIN eventos e ON a.evento_id = e.id
      WHERE a.data = $1
      ORDER BY a.horario
    `;
    const result = await db.query(query, [data]);
    return result.rows;
  },

  async criar(dados) {
    const { tipo, horario, data, funcionario_id, evento_id, disponivel = true } = dados;

    if (!horario || !data || !funcionario_id) {
      throw new Error('Campos obrigatórios: horario, data, funcionario_id');
    }

    const funcionarioCheck = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionario_id]);
    if (funcionarioCheck.rows.length === 0) throw new Error('Funcionário não encontrado');

    if (evento_id) {
      const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [evento_id]);
      if (eventoCheck.rows.length === 0) throw new Error('Evento não encontrado');
    }

    const conflito = await db.query(
      'SELECT id FROM agendamentos WHERE funcionario_id = $1 AND data = $2 AND horario = $3',
      [funcionario_id, data, horario]
    );
    if (conflito.rows.length > 0) throw new Error('Conflito de agendamento');

    const query = `
      INSERT INTO agendamentos (tipo, disponivel, horario, data, funcionario_id, evento_id)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
    `;
    const values = [tipo, disponivel, horario, data, funcionario_id, evento_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async atualizar(id, dados) {
    const { tipo, disponivel, horario, data, evento_id } = dados;

    const agendamentoAtual = await db.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
    if (agendamentoAtual.rows.length === 0) throw new Error('Agendamento não encontrado');

    if (horario && data) {
      const conflito = await db.query(
        'SELECT id FROM agendamentos WHERE funcionario_id = $1 AND data = $2 AND horario = $3 AND id <> $4',
        [agendamentoAtual.rows[0].funcionario_id, data, horario, id]
      );
      if (conflito.rows.length > 0) throw new Error('Conflito de agendamento');
    }

    const query = `
      UPDATE agendamentos 
      SET tipo = COALESCE($1, tipo),
          disponivel = COALESCE($2, disponivel),
          horario = COALESCE($3, horario),
          data = COALESCE($4, data),
          evento_id = $5
      WHERE id = $6
      RETURNING *
    `;
    const result = await db.query(query, [tipo, disponivel, horario, data, evento_id, id]);
    return result.rows[0];
  },

  async deletar(id) {
    const result = await db.query('DELETE FROM agendamentos WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) throw new Error('Agendamento não encontrado');
    return result.rows[0];
  },

  async alterarDisponibilidade(id, disponivel) {
    if (typeof disponivel !== 'boolean') throw new Error('Campo "disponivel" deve ser true ou false');

    const result = await db.query(
      'UPDATE agendamentos SET disponivel = $1 WHERE id = $2 RETURNING *',
      [disponivel, id]
    );
    if (result.rows.length === 0) throw new Error('Agendamento não encontrado');
    return result.rows[0];
  }
};

module.exports = agendamentoService;