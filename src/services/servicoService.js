const servicoModel = require('../models/servicoModel');

class ServicoService {
  async buscarTodos() {
    return await servicoModel.buscarTodos();
  }

  async buscarPorId(id) {
    return await servicoModel.buscarPorId(id);
  }

  async criar(dados) {
    return await servicoModel.criar(dados);
  }

  async atualizar(id, dados) {
    return await servicoModel.atualizar(id, dados);
  }

  async deletar(id) {
    return await servicoModel.deletar(id);
  }

  async calcularCustoTotal(servico_ids) {
    return await servicoModel.calcularCustoTotal(servico_ids);
  }
}

module.exports = new ServicoService();