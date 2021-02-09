const express = require( 'express' );
const router = express.Router();

const controller = require( '../controllers/conteudo' );

router.post('/add', controller.post_conteudo );

router.get( '/detalhes', controller.get_detalhes );

module.exports = router;