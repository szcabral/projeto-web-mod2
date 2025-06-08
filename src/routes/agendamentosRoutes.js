const express = require('express');
const router = express.Router();
const agendamentoController = require('../controllers/agendamentoController');

router.get('/', agendamentoController.listarTodos);
router.get('/disponiveis', agendamentoController.buscarDisponiveis);
router.get('/data/:data', agendamentoController.buscarPorData);
router.get('/:id', agendamentoController.buscarPorId);
router.get('/funcionario/:funcionarioId', agendamentoController.buscarPorFuncionario);
router.get('/evento/:eventoId', agendamentoController.buscarPorEvento);

router.post('/', agendamentoController.criar);
router.put('/:id', agendamentoController.atualizar);
router.delete('/:id', agendamentoController.deletar);
router.patch('/:id/disponibilidade', agendamentoController.alterarDisponibilidade);

module.exports = router;
