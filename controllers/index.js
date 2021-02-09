module.exports = {
    get_index: ( req, res )=>{              
        res.status( 200 ).redirect( '/clientes');
    },

    get_cadastro: ( req, res )=>{
        res.status( 200 ).render( 'cadastro', {
            title:'Tela de Cadastro'
        });
    }
}