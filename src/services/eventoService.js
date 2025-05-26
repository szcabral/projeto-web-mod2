const db = require('../config/database');

const eventoService = {
  async listarTodos() {
    const query = `
      SELECT 
        e.id, e.titulo, e.data, e.horario, e.preco_unitario,
        c.nome as cliente_nome, c.email as cliente_email
      FROM eventos e
      JOIN clientes c ON e.cliente_id = c.id
      ORDER BY e.data DESC, e.horario DESC
    `;
    const result = await db.query(query);
    return result.rows;
  },

  async buscarPorId(id) {
    const query = `
      SELECT 
        e.id, e.titulo, e.data, e.horario, e.preco_unitario,
        c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
      FROM eventos e
      JOIN clientes c ON e.cliente_id = c.id
      WHERE e.id = $1
    `;
    const result = await db.query(query, [id]);
    return result.rows[0];
  },

  async buscarPorCliente(clienteId) {
    const query = `
      SELECT id, titulo, data, horario, preco_unitario
      FROM eventos
      WHERE cliente_id = $1
      ORDER BY data DESC, horario DESC
    `;
    const result = await db.query(query, [clienteId]);
    return result.rows;
  },

  async criar({ titulo, data, horario, preco_unitario, cliente_id }) {
    const clienteCheck = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
    if (clienteCheck.rows.length === 0) {
      throw new Error('Cliente não encontrado');
    }

    const query = `
      INSERT INTO eventos (titulo, data, horario, preco_unitario, cliente_id)
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    `;
    const values = [titulo, data, horario, preco_unitario, cliente_id];
    const result = await db.query(query, values);
    return result.rows[0];
  },

  async atualizar(id, { titulo, data, horario, preco_unitario }) {
    const query = `
      UPDATE eventos 
      SET titulo = $1, data = $2, horario = $3, preco_unitario = $4
      WHERE id = $5
      RETURNING *
    `;
    const result = await db.query(query, [titulo, data, horario, preco_unitario, id]);
    return result.rows[0];
  },

  async deletar(id) {
    const client = await db.connect();
    try {
      await client.query('BEGIN');
      await client.query('DELETE FROM evento_funcionario WHERE evento_id = $1', [id]);
      await client.query('DELETE FROM evento_servico WHERE evento_id = $1', [id]);
      await client.query('DELETE FROM agendamentos WHERE evento_id = $1', [id]);
      const result = await client.query('DELETE FROM eventos WHERE id = $1 RETURNING *', [id]);
      await client.query('COMMIT');
      return result.rows[0];
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async adicionarFuncionario(eventoId, funcionarioId) {
    const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [eventoId]);
    const funcionarioCheck = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionarioId]);

    if (eventoCheck.rows.length === 0) throw new Error('Evento não encontrado');
    if (funcionarioCheck.rows.length === 0) throw new Error('Funcionário não encontrado');

    await db.query(`
      INSERT INTO evento_funcionario (evento_id, funcionario_id)
      VALUES ($1, $2)
      ON CONFLICT (evento_id, funcionario_id) DO NOTHING
    `, [eventoId, funcionarioId]);
  },

  async removerFuncionario(eventoId, funcionarioId) {
    await db.query(
      'DELETE FROM evento_funcionario WHERE evento_id = $1 AND funcionario_id = $2',
      [eventoId, funcionarioId]
    );
  },

  async listarFuncionarios(eventoId) {
    const result = await db.query(`
      SELECT f.id, f.nome, f.cargo
      FROM funcionarios f
      JOIN evento_funcionario ef ON f.id = ef.funcionario_id
      WHERE ef.evento_id = $1
    `, [eventoId]);
    return result.rows;
  },

  async adicionarServico(eventoId, servicoId) {
    const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [eventoId]);
    const servicoCheck = await db.query('SELECT id FROM servicos WHERE id = $1', [servicoId]);

    if (eventoCheck.rows.length === 0) throw new Error('Evento não encontrado');
    if (servicoCheck.rows.length === 0) throw new Error('Serviço não encontrado');

    await db.query(`
      INSERT INTO evento_servico (evento_id, servico_id)
      VALUES ($1, $2)
      ON CONFLICT (evento_id, servico_id) DO NOTHING
    `, [eventoId, servicoId]);
  },

  async removerServico(eventoId, servicoId) {
    await db.query(
      'DELETE FROM evento_servico WHERE evento_id = $1 AND servico_id = $2',
      [eventoId, servicoId]
    );
  },

  async listarServicos(eventoId) {
    const result = await db.query(`
      SELECT s.id, s.tipo, s.custo
      FROM servicos s
      JOIN evento_servico es ON s.id = es.servico_id
      WHERE es.evento_id = $1
    `, [eventoId]);
    return result.rows;
  }
};

module.exports = eventoService;
