const eventoService = require("../services/eventoService");

const eventoController = {
  async listarTodos(req, res) {
    try {
      const eventos = await eventoService.listarTodos();
      res.json({ sucesso: true, eventos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async buscarPorId(req, res) {
    try {
      const evento = await eventoService.buscarPorId(req.params.id);
      if (!evento) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado" });
      res.json({ sucesso: true, evento });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async buscarPorCliente(req, res) {
    try {
      const eventos = await eventoService.buscarPorCliente(req.params.clienteId);
      res.json({ sucesso: true, eventos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async criar(req, res) {
    try {
      const evento = await eventoService.criar(req.body);
      res.status(201).json({ sucesso: true, evento });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async atualizar(req, res) {
    try {
      const evento = await eventoService.atualizar(req.params.id, req.body);
      if (!evento) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado" });
      res.json({ sucesso: true, evento });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async deletar(req, res) {
    try {
      const evento = await eventoService.deletar(req.params.id);
      if (!evento) return res.status(404).json({ sucesso: false, erro: "Evento não encontrado" });
      res.json({ sucesso: true, mensagem: "Evento deletado com sucesso" });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async adicionarFuncionario(req, res) {
    try {
      await eventoService.adicionarFuncionario(req.params.id, req.body.funcionario_id);
      res.json({ sucesso: true, mensagem: "Funcionário adicionado ao evento com sucesso" });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async removerFuncionario(req, res) {
    try {
      await eventoService.removerFuncionario(req.params.eventoId, req.params.funcionarioId);
      res.json({ sucesso: true, mensagem: "Funcionário removido do evento com sucesso" });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async listarFuncionarios(req, res) {
    try {
      const funcionarios = await eventoService.listarFuncionarios(req.params.id);
      res.json({ sucesso: true, funcionarios });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async adicionarServico(req, res) {
    try {
      await eventoService.adicionarServico(req.params.id, req.body.servico_id);
      res.json({ sucesso: true, mensagem: "Serviço adicionado ao evento com sucesso" });
    } catch (error) {
      res.status(400).json({ sucesso: false, erro: error.message });
    }
  },

  async removerServico(req, res) {
    try {
      await eventoService.removerServico(req.params.eventoId, req.params.servicoId);
      res.json({ sucesso: true, mensagem: "Serviço removido do evento com sucesso" });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  },

  async listarServicos(req, res) {
    try {
      const servicos = await eventoService.listarServicos(req.params.id);
      res.json({ sucesso: true, servicos });
    } catch (error) {
      res.status(500).json({ sucesso: false, erro: error.message });
    }
  }
};

module.exports = eventoController;
