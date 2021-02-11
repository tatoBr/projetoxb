const { json } = require('express');
const fs = require( 'fs' );
const fsp = require('fs/promises');
const path = require( 'path' )
const clientesDataPath = path.join( 'data', 'cliente.json' );
const STATUS_CONTEUDO = { APROVADO: 0, EM_ANALISE: 2, REPROVADO: 3 };

module.exports = {
    get_clientes: async ( req, res )=>{         
        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            let parsedData = null;

            try{ parsedData = JSON.parse( data )}
            catch( err ){ parsedData = [] }
            
            return res.status( 200 ).json({ response: parsedData });
        })        
        .catch( err => {                
            if( err.code !== 'ENOENT') return res.status( 200 ).json({ response: [] })
            else return res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`});     
        });     
    },

    post_cliente: async ( req, res )=>{
        if( !fs.existsSync( path.join( 'data'))){
            fsp.mkdir( path.join( 'data' ))
            .then(()=> console.log( 'diretorio foi criado'))
            .catch( err =>  res.status( 500 ).json({ response: 'Erro ao Cria diretório: ' + err.message }));          
        }

        const { nome } = req.body;
        const id = Math.floor( 10000 + Math.random() * 89999 );
        
        if( !nome ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."})

        let clientes = null;
        let cliente = { id: id, nome: nome, conteudo: [] };

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            try{ clientes = JSON.parse( data )}
            catch( err ) { clientes = []}

            if( !Array.isArray( clientes )) clientes = [];                           
            
            clientes.push( cliente );           

            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
            .then(()=> res.status( 202 ).redirect( '/clientes' ))
            .catch( err => res.status( 500 ).json({ response: `Erro salvando arquivo: ${ err.message }`})
            )}
        )
        .catch( err => {
            if( err.code === 'ENOENT'){                
                clientes = [ cliente ]               
                fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
                .then(()=> res.status( 202 ).redirect( '/clientes' ))
                .catch( err => res.status( 500 ).json({ response: `Erro salvando arquivo: ${ err.message }`}));
            }
            else return res.status( 500 ).json({ response: `Erro salvando arquivo: ${ err.message }`})
        });
    },

    delete_cliente: async ( req, res )=>{
        const { clienteId } = req.params;

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            let clientes = null
            try{ clientes = JSON.parse( data )}
            catch( err ){ return res.status( 500 ).json({ response: 'Erro ao converter json.' + err.message })};
            
            
            const index = clientes.findIndex( cliente => cliente.id == clienteId );

            if( index >= 0 ){
                clientes.splice( index, 1 );
                fsp.writeFile( clientesDataPath, JSON.stringify( clientes ))
                .then(() => res.status( 200 ).json({ response: `Cliente com id ${ clienteId } apagado com sucesso` }))
                .catch( err => res.status( 500 ).json({ response: `Erro ao salvar arquivo. \nCódigo:${ err.code }\nMensagem:${ err.message }`}))
            }
            else{
                console.log( clienteId )
                return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.`})
            }            
        })
        .catch( err => res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`}));
    },   

    get_detalhes: async ( req, res )=>{
        let { clienteId } = req.params;
        let clientes = null;

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            try{ clientes = JSON.parse( data )}
            catch( err ) { clientes = []}

            let index = clientes.findIndex( cliente => cliente.id == clienteId );

            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` })
            return res.status( 200 ).json({ response: clientes[ index ]});
        })
        .catch( err => res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`}))   
    }
}