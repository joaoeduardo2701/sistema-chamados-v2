const router = require('express').Router();
const ctrl = require('../controllers/pedidosController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', ctrl.criar);
router.patch('/:id/status', ctrl.atualizarStatus);
router.delete('/:id', ctrl.deletar);

module.exports = router;