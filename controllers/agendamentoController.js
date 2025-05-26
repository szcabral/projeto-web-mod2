const agendamentoService = require('../services/agendamentoService');

const agendamentoController = {
  async listarTodos(req, res) {
    try {
      const agendamentos = await agendamentoService.listarTodos();
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const agendamento = await agendamentoService.buscarPorId(req.params.id);
      res.json(agendamento);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async buscarPorFuncionario(req, res) {
    try {
      const agendamentos = await agendamentoService.buscarPorFuncionario(req.params.funcionarioId);
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorEvento(req, res) {
    try {
      const agendamentos = await agendamentoService.buscarPorEvento(req.params.eventoId);
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarDisponiveis(req, res) {
    try {
      const agendamentos = await agendamentoService.buscarDisponiveis(req.query);
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async buscarPorData(req, res) {
    try {
      const agendamentos = await agendamentoService.buscarPorData(req.params.data);
      res.json(agendamentos);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  async criar(req, res) {
    try {
      const novo = await agendamentoService.criar(req.body);
      res.status(201).json(novo);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const atualizado = await agendamentoService.atualizar(req.params.id, req.body);
      res.json(atualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  async deletar(req, res) {
    try {
      await agendamentoService.deletar(req.params.id);
      res.json({ message: 'Agendamento deletado com sucesso' });
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  },

  async alterarDisponibilidade(req, res) {
    try {
      const { disponivel } = req.body;
      const atualizado = await agendamentoService.alterarDisponibilidade(req.params.id, disponivel);
      res.json(atualizado);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
};

module.exports = agendamentoController;
