const express = require('express');
const router = express.Router();
const servicoController = require('../controllers/servicoController');

router.get('/', servicoController.buscarTodos);
router.get('/:id', servicoController.buscarPorId);
router.post('/', servicoController.criar);
router.put('/:id', servicoController.atualizar);
router.delete('/:id', servicoController.deletar);
router.post('/calcular-custo', servicoController.calcularCustoTotal);

module.exports = router;
