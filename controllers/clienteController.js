class ClienteController {

  static async criar(req, res) {
    try {
      const { nome, email, telefone, cpf, senha } = req.body;

      if (!nome || !email || !cpf || !senha) {
        return res.status(400).json({ erro: 'Campos obrigatórios: nome, email, cpf, senha' });
      }

      const senhaHash = await bcrypt.hash(senha, 10);

      const novoCliente = await Cliente.criar({
        nome,
        email,
        telefone,
        cpf,
        senha: senhaHash
      });

      delete novoCliente.senha;

      res.status(201).json({
        sucesso: true,
        cliente: novoCliente
      });
    } catch (error) {
      res.status(400).json({
        erro: 'Erro ao criar cliente',
        detalhes: error.message
      });
    }
  }

  static async listar(req, res) {
    try {
      const clientes = await Cliente.buscarTodos();

      const clientesSemSenha = clientes.map(cliente => {
        delete cliente.senha;
        return cliente;
      });

      res.json({
        sucesso: true,
        clientes: clientesSemSenha
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro ao buscar clientes',
        detalhes: error.message
      });
    }
  }

  static async buscarPorId(req, res) {
    try {
      const { id } = req.params;
      const cliente = await Cliente.buscarPorId(id);

      if (!cliente) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      delete cliente.senha;

      res.json({
        sucesso: true,
        cliente
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro ao buscar cliente',
        detalhes: error.message
      });
    }
  }

  static async atualizar(req, res) {
    try {
      const { id } = req.params;
      const { nome, email, telefone, cpf } = req.body;

      const clienteAtualizado = await Cliente.atualizar(id, {
        nome,
        email,
        telefone,
        cpf
      });

      if (!clienteAtualizado) {
        return res.status(404).json({ erro: 'Cliente não encontrado' });
      }

      delete clienteAtualizado.senha;

      res.json({
        sucesso: true,
        cliente: clienteAtualizado
      });
    } catch (error) {
      res.status(400).json({
        erro: 'Erro ao atualizar cliente',
        detalhes: error.message
      });
    }
  }

  static async deletar(req, res) {
    try {
      const { id } = req.params;
      await Cliente.deletar(id);

      res.json({
        sucesso: true,
        mensagem: 'Cliente deletado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro ao deletar cliente',
        detalhes: error.message
      });
    }
  }

  static async login(req, res) {
    try {
      const { email, senha } = req.body;

      if (!email || !senha) {
        return res.status(400).json({ erro: 'Email e senha são obrigatórios' });
      }

      const cliente = await Cliente.buscarPorEmail(email);

      if (!cliente) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      const senhaValida = await bcrypt.compare(senha, cliente.senha);

      if (!senhaValida) {
        return res.status(401).json({ erro: 'Credenciais inválidas' });
      }

      delete cliente.senha;

      res.json({
        sucesso: true,
        cliente,
        mensagem: 'Login realizado com sucesso'
      });
    } catch (error) {
      res.status(500).json({
        erro: 'Erro ao fazer login',
        detalhes: error.message
      });
    }
  }
}