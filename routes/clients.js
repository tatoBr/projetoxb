const express = require( 'express' );
const controller = require( '../controllers/clients' );

const router = express.Router();

// GET > /clients
router.get( '/', controller.getClients);

// POST > /clients
router.post( '/', controller.postClient );

// DELETE /clientes/:clienteId
router.delete( '/:id', controller.deleteClient );

// GET > /clientes/detalhes
router.get( '/details/:id' , controller.getClient );

// PUT /clientes/:clienteId
router.patch( '/:id', controller.updateClient );

module.exports = router;