const funcionarioModel = require('../models/funcionarioModel');

class FuncionarioService {
  async buscarTodos() {
    return await funcionarioModel.buscarTodos();
  }

  async buscarPorId(id) {
    return await funcionarioModel.buscarPorId(id);
  }

  async criar(dados) {
    return await funcionarioModel.criar(dados);
  }

  async atualizar(id, dados) {
    return await funcionarioModel.atualizar(id, dados);
  }

  async deletar(id) {
    return await funcionarioModel.deletar(id);
  }

  async buscarEventos(id) {
    return await funcionarioModel.buscarEventos(id);
  }

  async buscarAgendamentos(id) {
    return await funcionarioModel.buscarAgendamentos(id);
  }

  async verificarDisponibilidade(id, data, horario) {
    return await funcionarioModel.verificarDisponibilidade(id, data, horario);
  }
}

module.exports = new FuncionarioService();
