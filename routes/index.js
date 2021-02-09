const express = require('express');
const controller = require( '../controllers/index' );
const autenticador = require( '../util/autenticacao' );

const router = express.Router();

/* GET => /index */
router.get('/', controller.get_index );

/* GET => /cadastro */
//router.get( '/cadastro', controller.get_cadastro );

/* POST => /cadastro */
    module.exports = router;
