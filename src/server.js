require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/database');
const path = require('path');

// Configurações do EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Conexão com o banco
db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rotas dos recursos (API)
    const clientesRoutes     = require('./routes/clientesRoutes');
    const funcionariosRoutes = require('./routes/funcionariosRoutes');
    const servicosRoutes     = require('./routes/servicosRoutes');
    const eventosRoutes      = require('./routes/eventosRoutes');
    const agendamentosRoutes = require('./routes/agendamentosRoutes');

    app.use('/clientes',     clientesRoutes);
    app.use('/funcionarios', funcionariosRoutes);
    app.use('/servicos',     servicosRoutes);
    app.use('/eventos',      eventosRoutes);
    app.use('/agendamentos', agendamentosRoutes);

    // Servir estáticos (CSS, JS, imagens)
    app.use(express.static(path.join(__dirname, 'public')));

    // --- Rotas de Páginas ---

    // Home
    app.get('/', (req, res) => {
      res.render('pages/home');
    });

    // Login de Cliente (página estática, sem lógica de autenticação)
    app.get('/login-clientes', (req, res) => {
      res.render('pages/login');
    });

    // Após clicar em "Clientes", redireciona para o dashboard de cliente
    app.get('/clienteDashboard', (req, res) => {
      res.render('pages/clienteDashboard');
    });

    // Login de Funcionário (página estática, sem lógica de autenticação)
    app.get('/login-funcionarios', (req, res) => {
      res.render('pages/login-funcionarios');
    });

    // Após clicar em "Funcionários", redireciona para o dashboard de funcionário
    app.get('/funcionarioDashboard', (req, res) => {
      res.render('pages/funcionarioDashboard');
    });

    // Formulário de criação de evento
    app.get('/eventos/novo', (req, res) => {
      res.render('pages/novoEvento');
    });

    // --- Tratamentos de Erro ---

    // 404
    app.use((req, res) => {
      res.status(404).send('Página não encontrada');
    });

    // 500
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Erro no servidor');
    });

    // Iniciar servidor
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
