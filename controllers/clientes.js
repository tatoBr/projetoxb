const { json } = require('express');
const fs = require( 'fs' );
const path = require( 'path' )
const clientesDataPath = path.join( 'data', 'cliente.json' );
const STATUS_CONTEUDO = { APROVADO: 0, EM_ANALISE: 2, REPROVADO: 3 };

module.exports = {
    get_clientes: ( req, res )=>{     
        fs.readFile( clientesDataPath, ( err, data )=> {
            console.log( err );
            if( !err ) return res.status( 200 ).render( 'clientes', { title: 'Clientes', clientes: JSON.parse( data )});
            else if( err.code === 'ENOENT' ) return res.status( 200 ).render( 'clientes', { title: 'Clientes', clientes: [] });           
            return res.status( 500 ).send( 'erro ao ler arquivo.' );
        });       
    },

    post_cliente: ( req, res )=>{
        const { nome } = req.body;
        const id = Math.floor( 10000 + Math.random() * 89999 );
        let cliente = { id: id, nome: nome, conteudo: [] };
        let clientes = null;
        fs.readFile( clientesDataPath, ( err, data ) => {
            if( !err ){
                clientes = JSON.parse( data );              

                if( Array.isArray( clientes )) clientes.push( cliente );
                else{
                    clientes = [];
                    clientes.push( cliente );
                }
                fs.writeFile( clientesDataPath, JSON.stringify( clientes ), err => {
                    if( !err ) return res.status( 202 ).redirect( '/clientes' );
                    return res.status( 500 ).send( 'Erro ao Salvar Arquivo' );
                });
            } else {
                clientes = []
                clientes.push( cliente );
                fs.writeFile( clientesDataPath, JSON.stringify( clientes ), err => {
                    if( !err ) return res.status( 202 ).redirect( '/clientes' );
                    return res.status( 500 ).send( 'Erro ao Salvar Arquivo' );
                });                
            }
        })
    },    

    get_detalhes: ( req, res )=>{
        let cliente_id = req.query.id;

        fs.readFile( clientesDataPath, ( err, data )=>{
            if( !err ){
                let clientes = JSON.parse( data );
                let clienteIndex = clientes.findIndex( cliente => cliente.id == cliente_id );
                return res.status( 200 ).render( 'detalhes-cliente', {
                    title: `Detalhes do Cliente ${ clientes[ clienteIndex ].nome }`,
                    cliente: clientes[ clienteIndex ],
                    index: clienteIndex
                });
            }
            return res.status( 500 ).send( 'erro ao ler arquivo.' );
        })
    },

    post_conteudo: ( req, res )=>{
        const { id, titulo, detalhes } = req.body;
        const idconteudo = Math.floor( Math.random() * 999_999 );
        
        fs.readFile( clientesDataPath, ( err, data )=>{
            if( err ) return res.status( 500 ).send( 'Erro ao Ler arquivo ' );

            const clientes = JSON.parse( data );
            clientes.map( cliente =>{
                if( cliente.id == id ) {
                    cliente.conteudo.push({
                        id: idconteudo,
                        titulo: titulo,
                        detalhes: [{ detalhes: detalhes, date: new Date()}],
                        status: STATUS_CONTEUDO.EM_ANALISE                    
                    });
                    console.log( cliente );
                }
            });
            
        });
    }
}