const express = require( 'express' );
const router = express.Router();

const controller = require( '../controllers/conteudo' );

// POST >> conteudo/add
router.post('/add/:clienteId', controller.post_conteudo );

// GET >> conteudo/detalhes
router.get( '/detalhes/:clienteId/:conteudoId', controller.get_conteudo );

// Delete >> conteudo/delete
router.delete( '/delete/:clienteId/:conteudoId', controller.delete_conteudo)

module.exports = router;