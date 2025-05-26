const express = require('express');
const router = express.Router();
const ClienteController = require('../controllers/ClienteController');

router.post('/login', ClienteController.login);
router.post('/', ClienteController.criar);
router.get('/:id', ClienteController.buscarPorId);
router.put('/:id', ClienteController.atualizar);
router.delete('/:id', ClienteController.deletar);

module.exports = router;
