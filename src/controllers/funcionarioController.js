const funcionarioService = require('../services/funcionarioService');

class FuncionarioController {
  async index(req, res) {
    try {
      const funcionarios = await funcionarioService.buscarTodos();
      res.json({ success: true, data: funcionarios });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar funcionários', error: error.message });
    }
  }

  async show(req, res) {
    try {
      const { id } = req.params;
      const funcionario = await funcionarioService.buscarPorId(id);

      if (!funcionario) {
        return res.status(404).json({ success: false, message: 'Funcionário não foi encontrado' });
      }

      res.json({ success: true, data: funcionario });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar funcionário', error: error.message });
    }
  }

  async store(req, res) {
    try {
      const { nome, cargo, senha } = req.body;
      if (!nome || !senha) {
        return res.status(400).json({ success: false, message: 'Nome e senha são obrigatórios' });
      }

      const funcionario = await funcionarioService.criar({ nome, cargo, senha });
      res.status(201).json({ success: true, message: 'Funcionário criado com sucesso', data: { ...funcionario, senha: undefined } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao criar funcionário', error: error.message });
    }
  }

  async update(req, res) {
    try {
      const { id } = req.params;
      const { nome, cargo } = req.body;

      const funcionario = await funcionarioService.atualizar(id, { nome, cargo });
      if (!funcionario) {
        return res.status(404).json({ success: false, message: 'Funcionário não foi encontrado' });
      }

      res.json({ success: true, message: 'Funcionário atualizado com sucesso', data: funcionario });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao atualizar funcionário', error: error.message });
    }
  }

  async destroy(req, res) {
    try {
      const { id } = req.params;
      await funcionarioService.deletar(id);
      res.json({ success: true, message: 'Funcionário removido com sucesso' });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao remover funcionário', error: error.message });
    }
  }

  async eventos(req, res) {
    try {
      const { id } = req.params;
      const eventos = await funcionarioService.buscarEventos(id);
      res.json({ success: true, data: eventos });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar eventos do funcionário', error: error.message });
    }
  }

  async agendamentos(req, res) {
    try {
      const { id } = req.params;
      const agendamentos = await funcionarioService.buscarAgendamentos(id);
      res.json({ success: true, data: agendamentos });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao buscar agendamentos do funcionário', error: error.message });
    }
  }

  async verificarDisponibilidade(req, res) {
    try {
      const { id } = req.params;
      const { data, horario } = req.query;
      if (!data || !horario) {
        return res.status(400).json({ success: false, message: 'Data e horário são obrigatórios' });
      }

      const disponivel = await funcionarioService.verificarDisponibilidade(id, data, horario);
      res.json({ success: true, data: { disponivel } });
    } catch (error) {
      res.status(500).json({ success: false, message: 'Erro ao verificar disponibilidade', error: error.message });
    }
  }
}

module.exports = new FuncionarioController();