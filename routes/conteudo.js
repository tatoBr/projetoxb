const express = require( 'express' );
const router = express.Router();

const controller = require( '../controllers/conteudo' );

// POST >> conteudo/add
router.post('/add/:clienteId', controller.post_conteudo );

// GET >> conteudo/detalhes
router.get( '/detalhes/:clienteId/:conteudoId', controller.get_conteudo );

// PUT >> conteudo/update
router.put( '/update/:clienteId/:conteudoId', controller.update_conteudo );

// Delete >> conteudo/delete
router.delete( '/delete/:clienteId/:conteudoId', controller.delete_conteudo)

// PUT >> conteudo/timeline/add
router.put( '/timeline/add/:clienteId/:conteudoId', controller.add_to_timeline );

module.exports = router;