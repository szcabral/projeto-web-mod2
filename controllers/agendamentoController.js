const db = require('../config/database');

const agendamentoController = {
  async listarTodos(req, res) {
    try {
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
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar agendamentos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
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
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Agendamento não foi encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorFuncionario(req, res) {
    try {
      const { funcionarioId } = req.params;
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
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do funcionário:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorEvento(req, res) {
    try {
      const { eventoId } = req.params;
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
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar agendamentos do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarDisponiveis(req, res) {
    try {
      const { data, funcionario_id } = req.query;
      
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
        query += ` AND a.data = $${paramCount}`;
        values.push(data);
        paramCount++;
      }
      
      if (funcionario_id) {
        query += ` AND a.funcionario_id = $${paramCount}`;
        values.push(funcionario_id);
        paramCount++;
      }
      
      query += ' ORDER BY a.data, a.horario';
      
      const result = await db.query(query, values);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar agendamentos disponíveis:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorData(req, res) {
    try {
      const { data } = req.params;
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
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar agendamentos por data:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req, res) {
    try {
      const { tipo, horario, data, funcionario_id, evento_id, disponivel = true } = req.body;

      if (!horario || !data || !funcionario_id) {
        return res.status(400).json({ 
          error: 'Campos obrigatórios: horario, data, funcionario_id' 
        });
      }

      const funcionarioCheck = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionario_id]);
      if (funcionarioCheck.rows.length === 0) {
        return res.status(400).json({ error: 'O Funcionário não foi encontrado' });
      }

      if (evento_id) {
        const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [evento_id]);
        if (eventoCheck.rows.length === 0) {
          return res.status(400).json({ error: 'O Evento não foi encontrado' });
        }
      }

      const conflictCheck = await db.query(
        'SELECT id FROM agendamentos WHERE funcionario_id = $1 AND data = $2 AND horario = $3',
        [funcionario_id, data, horario]
      );
      
      if (conflictCheck.rows.length > 0) {
        return res.status(400).json({ 
          error: 'Funcionário já possui agendamento neste horário' 
        });
      }

      const query = `
        INSERT INTO agendamentos (tipo, disponivel, horario, data, funcionario_id, evento_id)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *
      `;
      const values = [tipo, disponivel, horario, data, funcionario_id, evento_id];
      const result = await db.query(query, values);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { tipo, disponivel, horario, data, evento_id } = req.body;

      const agendamentoAtual = await db.query('SELECT * FROM agendamentos WHERE id = $1', [id]);
      if (agendamentoAtual.rows.length === 0) {
        return res.status(404).json({ error: 'O Agendamento não foi encontrado' });
      }

      if (horario && data) {
        const conflictCheck = await db.query(
          'SELECT id FROM agendamentos WHERE funcionario_id = $1 AND data = $2 AND horario = $3 AND id <> $4',
          [agendamentoAtual.rows[0].funcionario_id, data, horario, id]
        );
        
        if (conflictCheck.rows.length > 0) {
          return res.status(400).json({ 
            error: 'Funcionário já possui agendamento neste horário' 
          });
        }
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
      const values = [tipo, disponivel, horario, data, evento_id, id];
      const result = await db.query(query, values);
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
      
      const result = await db.query('DELETE FROM agendamentos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Agendamento não foi encontrado' });
      }
      
      res.json({ message: 'O Agendamento foi deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar agendamento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async alterarDisponibilidade(req, res) {
    try {
      const { id } = req.params;
      const { disponivel } = req.body;
      
      if (typeof disponivel !== 'boolean') {
        return res.status(400).json({ 
          error: 'Campo disponivel deve ser true ou false' 
        });
      }

      const query = `
        UPDATE agendamentos 
        SET disponivel = $1
        WHERE id = $2
        RETURNING *
      `;
      const result = await db.query(query, [disponivel, id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Agendamento não foi encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao alterar disponibilidade:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = agendamentoController;