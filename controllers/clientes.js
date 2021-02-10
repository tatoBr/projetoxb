const { json } = require('express');
const fs = require( 'fs' );
const fsp = require('fs/promises');
const path = require( 'path' )
const clientesDataPath = path.join( 'data', 'cliente.json' );
const STATUS_CONTEUDO = { APROVADO: 0, EM_ANALISE: 2, REPROVADO: 3 };



module.exports = {
    get_clientes: async ( req, res )=>{         
        let lerClientes = fsp.readFile( clientesDataPath, 'utf-8' )
            .then( data => res.status( 200 ).render( 'clientes', { title: 'Clientes', clientes: JSON.parse( data )}))        
            .catch( err => {                
                if( err.code !== 'ENOENT') return res.status( 200 ).render( 'clientes', { title: 'Clientes', clientes: []}) 
                else return res.status( 200 ).render( 'clientes', { title: 'Clientes', clientes: []});                
        
        });     
    },

    post_cliente: async ( req, res )=>{
        if( !fs.existsSync( path.join( 'data'))){
            fsp.mkdir( path.join( 'data' ))
            .then(()=> console.log( 'diretorio foi criado'))
            .catch( err =>  res.status( 500 ).send( 'Erro ao Cria diretório: ' + err.message ));          
        }

        const { nome } = req.body;
        const id = Math.floor( 10000 + Math.random() * 89999 );
        let clientes = null;
        let cliente = { id: id, nome: nome, conteudo: [] };

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            try{ clientes = JSON.parse( data )}
            catch( err ) { clientes = []}

            if( Array.isArray( clientes )) clientes.push( cliente )
            else{
                clientes = [];
                clientes.push( cliente );
            }

            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
            .then(()=> res.status( 202 ).redirect( '/clientes' ))
            .catch( err => res.status( 500 ).send( 'Erro ao Salvar Arquivo: ' + err.message ));
        })
        .catch( err => {
            if( err.code === 'ENOENT'){
                clientes = [] 
                clientes.push( cliente );
                fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
                .then(()=> res.status( 202 ).redirect( '/clientes' ))
                .catch( err => res.status( 500 ).send( 'Erro ao Salvar Arquivo: ' + err.message ));
            }
            else return res.status( 500 ).send( 'Erro ao Salvar Arquivo: ' + err.message )
        });
    },    

    get_detalhes: async ( req, res )=>{
        let cliente_id = req.query.id;
        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            try{ clientes = JSON.parse( data )}
            catch( err ) { clientes = []}
            let index = clientes.findIndex( cliente => cliente.id == cliente_id );
            return res.status( 200 ).render( 'detalhes-cliente', {
                title: `Detalhes do Cliente ${ clientes[ index ].nome }`,
                cliente: clientes[ index ],
                index: index
            });
        })
        .catch( err => res.status( 500 ).send( 'erro ao ler arquivo. ' + err.message ))        
    },

    post_conteudo: async( req, res )=>{
        const { id: cliente_id, titulo, detalhes } = req.body;
        const idconteudo = Math.floor( Math.random() * 999_999 );
        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            try{ clientes = JSON.parse( data )}
            catch( err ) { clientes = []}

            let index = clientes.findIndex( cliente => cliente.id == cliente_id );
            if( index < 0 ) return res.status( 404 ).send( 'usuario não encontrado' );

            clientes[ index ].conteudo.push({
                id: idconteudo,
                titulo: titulo,
                detalhes: [{ detalhes: detalhes, date: new Date()}],
                status: STATUS_CONTEUDO.EM_ANALISE
            });
            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
            .then(() => res.status( 202 ).redirect( '/clientes' ))
            .catch( err => res.status( 500 ).send( 'Erro ao Salvar Arquivo: ' + err.message ));
        })
        .catch( err => res.status( 500 ).send( 'erro ao ler arquivo. ' + err.message ));        
    }
}