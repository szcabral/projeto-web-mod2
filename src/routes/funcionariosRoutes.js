const express = require('express');
const router = express.Router();
const funcionarioController = require('../controllers/funcionarioController');

router.get('/', funcionarioController.index);
router.get('/:id', funcionarioController.show);
router.post('/', funcionarioController.store);
router.put('/:id', funcionarioController.update);
router.delete('/:id', funcionarioController.destroy);
router.get('/:id/eventos', funcionarioController.eventos);
router.get('/:id/agendamentos', funcionarioController.agendamentos);
router.get('/:id/disponibilidade', funcionarioController.verificarDisponibilidade);

module.exports = router;
