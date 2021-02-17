const express = require( 'express' );
const { route } = require('.');
const router = express.Router( {mergeParams: true});

const controller = require( '../controllers/content' );

// POST >> '/content'
router.post('/', controller.postContent );

// GET >> /content
router.get( '/', controller.getContents )

// GET >> content/:id
router.get( '/:contentId', controller.getContent );

// PUT >> conteudo/update
router.patch( '/:contentId', controller.updateContent);

// Delete >> conteudo/delete
router.delete( '/:contentId', controller.deleteContent)

// POST >> conteudo/timeline/add
router.post( '/:contentId/timeline', controller.addToTimeline );

module.exports = router;