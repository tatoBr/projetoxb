const fs = require( 'fs' );
const path = require( 'path' );
const clientesDataPath = path.join( 'data', 'cliente.json' );

const STATUS_CONTEUDO = { APROVADO: 'Aprovado', EM_ANALISE: 'Em Análise', REPROVADO: "Reprovado" };

module.exports = {    
    post_conteudo: ( req, res )=>{        
        const { clienteId, titulo, detalhes } = req.body;
        const idconteudo = Math.floor( Math.random() * 999_999 );

        fs.readFile( clientesDataPath, ( err, data )=>{
            if( err ) return res.status( 500 ).send( 'Erro ao Ler arquivo ' );

            const clientes = JSON.parse( data );
            clientes.map( cliente =>{                
                if( cliente.id == clienteId ) {
                    cliente.conteudo.push({
                        id: idconteudo,
                        titulo: titulo,
                        timeline: [{ descricao: detalhes, date: new Date()}],
                        status: STATUS_CONTEUDO.EM_ANALISE                    
                    });                    
                }
            });
            fs.writeFile( clientesDataPath, JSON.stringify( clientes ), err => {
                if ( err ) return res.status( 500 ).send( 'Erro ao salvar arquivo' );
                
                res.status( 201 ).redirect( '/clientes')
            });
        });
    },
    get_detalhes: ( req, res ) => {
        const { idcliente, conteudoindex } = req.query;

        fs.readFile( clientesDataPath, ( err, data )=>{
            if( err ) return res.status( 500 ).send( 'Erro ao Ler arquivo');

            const clientes = JSON.parse( data );
            const index = clientes.findIndex( cliente => cliente.id == idcliente );

            res.status( 200 ).render( 'detalhes-conteudo',{
                title: 'Detalhes do Conteúdo',
                cliente: clientes[ index ],
                conteudo: clientes[ index ].conteudo[ conteudoindex ]
            });
            
        });
        
    }
}