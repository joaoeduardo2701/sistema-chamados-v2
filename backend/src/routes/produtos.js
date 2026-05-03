const router = require('express').Router();
const ctrl = require('../controllers/produtosController');

router.get('/', ctrl.listar);
router.get('/:id', ctrl.buscarPorId);
router.post('/', ctrl.criar);
router.put('/:id', ctrl.atualizar);
router.delete('/:id', ctrl.deletar);

module.exports = router;