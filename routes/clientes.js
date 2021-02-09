const express = require( 'express' );
const controller = require( '../controllers/clientes' );

const router = express.Router();

// GET > /clientes
router.get( '/', controller.get_clientes );

// POST > /clientes/
router.post( '/add', controller.post_cliente );

// GET > clientes/detalhes
router.get( '/detalhes' , controller.get_detalhes );

module.exports = router;