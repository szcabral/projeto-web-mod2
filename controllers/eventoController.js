const db = require('../config/database'); // Assumindo conexão com PostgreSQL

const eventoController = {
  async listarTodos(req, res) {
    try {
      const query = `
        SELECT 
          e.id, e.titulo, e.data, e.horario, e.preco_unitario,
          c.nome as cliente_nome, c.email as cliente_email
        FROM eventos e
        JOIN clientes c ON e.cliente_id = c.id
        ORDER BY e.data DESC, e.horario DESC
      `;
      const result = await db.query(query);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar eventos:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const query = `
        SELECT 
          e.id, e.titulo, e.data, e.horario, e.preco_unitario,
          c.nome as cliente_nome, c.email as cliente_email, c.telefone as cliente_telefone
        FROM eventos e
        JOIN clientes c ON e.cliente_id = c.id
        WHERE e.id = $1
      `;
      const result = await db.query(query, [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Evento não foi encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao buscar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async buscarPorCliente(req, res) {
    try {
      const { clienteId } = req.params;
      const query = `
        SELECT id, titulo, data, horario, preco_unitario
        FROM eventos
        WHERE cliente_id = $1
        ORDER BY data DESC, horario DESC
      `;
      const result = await db.query(query, [clienteId]);
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao buscar eventos do cliente:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async criar(req, res) {
    try {
      const { titulo, data, horario, preco_unitario, cliente_id } = req.body;

      if (!titulo || !data || !horario || !cliente_id) {
        return res.status(400).json({ error: 'Campos obrigatórios: titulo, data, horario, cliente_id' });
      }

      const clienteCheck = await db.query('SELECT id FROM clientes WHERE id = $1', [cliente_id]);
      if (clienteCheck.rows.length === 0) {
        return res.status(400).json({ error: 'O Cliente não foi encontrado' });
      }

      const query = `
        INSERT INTO eventos (titulo, data, horario, preco_unitario, cliente_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [titulo, data, horario, preco_unitario, cliente_id];
      const result = await db.query(query, values);
      
      res.status(201).json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao criar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { titulo, data, horario, preco_unitario } = req.body;
      
      const query = `
        UPDATE eventos 
        SET titulo = $1, data = $2, horario = $3, preco_unitario = $4
        WHERE id = $5
        RETURNING *
      `;
      const values = [titulo, data, horario, preco_unitario, id];
      const result = await db.query(query, values);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Evento não foi encontrado' });
      }
      
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Erro ao atualizar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async deletar(req, res) {
    try {
      const { id } = req.params;
 
      await db.query('DELETE FROM evento_funcionario WHERE evento_id = $1', [id]);
      await db.query('DELETE FROM evento_servico WHERE evento_id = $1', [id]);
      await db.query('DELETE FROM agendamentos WHERE evento_id = $1', [id]);

      const result = await db.query('DELETE FROM eventos WHERE id = $1 RETURNING *', [id]);
      
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'O Evento não foi encontrado' });
      }
      
      res.json({ message: 'Evento deletado com sucesso' });
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async adicionarFuncionario(req, res) {
    try {
      const { id } = req.params;
      const { funcionario_id } = req.body;

      const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [id]);
      const funcionarioCheck = await db.query('SELECT id FROM funcionarios WHERE id = $1', [funcionario_id]);
      
      if (eventoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'O Evento não foi encontrado' });
      }
      if (funcionarioCheck.rows.length === 0) {
        return res.status(404).json({ error: 'Funcionário não encontrado' });
      }

      const query = `
        INSERT INTO evento_funcionario (evento_id, funcionario_id)
        VALUES ($1, $2)
        ON CONFLICT (evento_id, funcionario_id) DO NOTHING
      `;
      await db.query(query, [id, funcionario_id]);
      
      res.json({ message: 'Funcionário foi adicionado ao evento com sucesso' });
    } catch (error) {
      console.error('Erro ao adicionar funcionário ao evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async removerFuncionario(req, res) {
    try {
      const { eventoId, funcionarioId } = req.params;
      
      const result = await db.query(
        'DELETE FROM evento_funcionario WHERE evento_id = $1 AND funcionario_id = $2',
        [eventoId, funcionarioId]
      );
      
      res.json({ message: 'O Funcionário foi removido do evento com sucesso' });
    } catch (error) {
      console.error('Erro ao remover funcionário do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarFuncionarios(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT f.id, f.nome, f.cargo
        FROM funcionarios f
        JOIN evento_funcionario ef ON f.id = ef.funcionario_id
        WHERE ef.evento_id = $1
      `;
      const result = await db.query(query, [id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar funcionários do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async adicionarServico(req, res) {
    try {
      const { id } = req.params;
      const { servico_id } = req.body;

      const eventoCheck = await db.query('SELECT id FROM eventos WHERE id = $1', [id]);
      const servicoCheck = await db.query('SELECT id FROM servicos WHERE id = $1', [servico_id]);
      
      if (eventoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'O Evento não foi encontrado' });
      }
      if (servicoCheck.rows.length === 0) {
        return res.status(404).json({ error: 'O Serviço não foi encontrado' });
      }

      const query = `
        INSERT INTO evento_servico (evento_id, servico_id)
        VALUES ($1, $2)
        ON CONFLICT (evento_id, servico_id) DO NOTHING
      `;
      await db.query(query, [id, servico_id]);
      
      res.json({ message: 'O Serviço foi adicionado ao evento com sucesso' });
    } catch (error) {
      console.error('Erro ao adicionar serviço ao evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async removerServico(req, res) {
    try {
      const { eventoId, servicoId } = req.params;
      
      const result = await db.query(
        'DELETE FROM evento_servico WHERE evento_id = $1 AND servico_id = $2',
        [eventoId, servicoId]
      );
      
      res.json({ message: 'O Serviço foi removido do evento com sucesso' });
    } catch (error) {
      console.error('Erro ao remover serviço do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  },

  async listarServicos(req, res) {
    try {
      const { id } = req.params;
      
      const query = `
        SELECT s.id, s.tipo, s.custo
        FROM servicos s
        JOIN evento_servico es ON s.id = es.servico_id
        WHERE es.evento_id = $1
      `;
      const result = await db.query(query, [id]);
      
      res.json(result.rows);
    } catch (error) {
      console.error('Erro ao listar serviços do evento:', error);
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }
};

module.exports = eventoController;