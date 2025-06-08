const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/clienteController');

router.post('/', ClienteController.criar);
router.get('/', ClienteController.listar);
router.get('/:id', ClienteController.buscarPorId);
router.put('/:id', ClienteController.atualizar);
router.delete('/:id', ClienteController.deletar);
router.post('/login', ClienteController.login);

module.exports = router;
