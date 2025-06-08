const express = require('express');
const router = express.Router();
const eventoController = require('../controllers/eventoController');

router.get('/', eventoController.listarTodos);
router.get('/:id', eventoController.buscarPorId);
router.get('/cliente/:clienteId', eventoController.buscarPorCliente);
router.post('/', eventoController.criar);
router.put('/:id', eventoController.atualizar);
router.delete('/:id', eventoController.deletar);

router.post('/:id/funcionarios', eventoController.adicionarFuncionario);
router.delete('/:eventoId/funcionarios/:funcionarioId', eventoController.removerFuncionario);
router.get('/:id/funcionarios', eventoController.listarFuncionarios);

router.post('/:id/servicos', eventoController.adicionarServico);
router.delete('/:eventoId/servicos/:servicoId', eventoController.removerServico);
router.get('/:id/servicos', eventoController.listarServicos);

module.exports = router;
