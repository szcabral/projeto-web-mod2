require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./config/database');
const path = require('path');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

db.connect()
  .then(() => {
    console.log('Conectado ao banco de dados PostgreSQL');

    app.use(express.json());

    const clientesRoutes = require('./routes/clientesRoutes');
    const funcionariosRoutes = require('./routes/funcionariosRoutes');
    const servicosRoutes = require('./routes/servicosRoutes');
    const eventosRoutes = require('./routes/eventosRoutes');
    const agendamentosRoutes = require('./routes/agendamentosRoutes');

    app.use('/clientes', clientesRoutes);
    app.use('/funcionarios', funcionariosRoutes);
    app.use('/servicos', servicosRoutes);
    app.use('/eventos', eventosRoutes);
    app.use('/agendamentos', agendamentosRoutes);

    app.use(express.static(path.join(__dirname, 'public')));

     app.get('/', (req, res) => {
      res.render('pages/home');
    });

    app.get('/login-clientes', (req, res) => {
  res.render('pages/login');
});

app.get('/login-funcionarios', (req, res) => {
  res.render('pages/login-funcionarios');
});

    app.use((req, res, next) => {
      res.status(404).send('Página não encontrada');
    });

    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send('Erro no servidor');
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Erro ao conectar ao banco de dados:', err);
  });
