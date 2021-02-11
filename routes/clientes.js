const express = require( 'express' );
const controller = require( '../controllers/clientes' );

const router = express.Router();

// GET > /clientes
router.get( '/', controller.get_clientes );

// POST > /clientes/add
router.post( '/add', controller.post_cliente );

// DELETE /clientes/:clienteId
router.delete( '/delete/:clienteId', controller.delete_cliente );

// GET > /clientes/detalhes
router.get( '/detalhes/:clienteId' , controller.get_cliente );

// PUT /clientes/:clienteId
router.put( '/update/:clienteId', controller.update_cliente );

module.exports = router;