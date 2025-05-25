const ClienteModel = require('../models/clienteModel');

class ClienteController {
  static async listar(req, res) {
    try {
      const clientes = await ClienteModel.getAll();
      res.json(clientes);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao listar clientes' });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const cliente = await ClienteModel.getById(req.params.id);
      if (!cliente) return res.status(404).json({ erro: 'Cliente não foi encontrado' });
      res.json(cliente);
    } catch (error) {
      res.status(500).json({ erro: 'Erro na busca de cliente' });
    }
  }

  static async criar(req, res) {
    try {
      const novoCliente = await ClienteModel.create(req.body);
      res.status(201).json(novoCliente);
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao criar cliente' });
    }
  }

  static async atualizar(req, res) {
    try {
      const clienteAtualizado = await ClienteModel.update(req.params.id, req.body);
      res.json(clienteAtualizado);
    } catch (error) {
      res.status(500).json({ erro: 'Erro no atualizar cliente' });
    }
  }

  static async deletar(req, res) {
    try {
      await ClienteModel.delete(req.params.id);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ erro: 'Erro ao deletar cliente' });
    }
  }
}

module.exports = ClienteController;
