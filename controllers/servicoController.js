const servicoService = require('../services/servicoService');

class ServicoController {
  async buscarTodos(req, res) {
    try {
      const servicos = await servicoService.buscarTodos();
      res.json(servicos);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar serviços' });
    }
  }

  async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const servico = await servicoService.buscarPorId(id);
      if (!servico) return res.status(404).json({ erro: 'Serviço não encontrado' });
      res.json(servico);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao buscar serviço' });
    }
  }

  async criar(req, res) {
    try {
      const novoServico = await servicoService.criar(req.body);
      res.status(201).json(novoServico);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar serviço' });
    }
  }

  async atualizar(req, res) {
    try {
      const { id } = req.params;
      const servicoAtualizado = await servicoService.atualizar(id, req.body);
      res.json(servicoAtualizado);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao atualizar serviço' });
    }
  }

  async deletar(req, res) {
    try {
      const { id } = req.params;
      await servicoService.deletar(id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar serviço' });
    }
  }

  async calcularCustoTotal(req, res) {
    try {
      const { servico_ids } = req.body; // Expects { servico_ids: [1, 2, 3] }
      const total = await servicoService.calcularCustoTotal(servico_ids);
      res.json({ custo_total: total });
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao calcular custo total' });
    }
  }
}

module.exports = new ServicoController();
