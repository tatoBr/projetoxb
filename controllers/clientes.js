const fs = require( 'fs' );
const fsp = require('fs/promises');
const path = require( 'path' )
const { carregarClientes, salvarClientes, criarDiretorio } = require( '../util/fileSystemUtil' );

const clientesDataPath = path.join( 'data', 'cliente.json' );

module.exports = {
    get_clientes: async ( req, res )=>{
        try {
            await criarDiretorio( 'data' );
            const clientes = await carregarClientes( clientesDataPath );
            res.status( 200 ).json({ response :  clientes });
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }            
    },

    post_cliente: async ( req, res )=>{
        const { nome } = req.body;
        const id = Math.floor( 10000 + Math.random() * 89999 );
        let cliente = { id: id, nome: nome, conteudo: [] };

        if( !nome ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."})

        try {
            await criarDiretorio( 'data' );
            const clientes = await carregarClientes( clientesDataPath );
            clientes.push( cliente );
            const clientesSalvos = await salvarClientes( clientesDataPath, clientes );
            return res.status( 201 ).json({ response: clientesSalvos });

        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },

    update_cliente: async ( req, res )=>{
        const { clienteId } = req.params;
        const { nome } = req.body;

        if( [ clienteId, nome ].includes( undefined )) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clientes = await carregarClientes( clientesDataPath );

            let index = clientes.findIndex( cliente => cliente.id == clienteId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });

            clientes[ index ].nome = nome;
            await salvarClientes( clientesDataPath, clientes );

            return res.status( 202 ).json({ response: clientes[ index ] });

        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },

    delete_cliente: async ( req, res )=>{
        const { clienteId } = req.params;
        if( !clienteId ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clientes = await carregarClientes( clientesDataPath );

            let index = clientes.findIndex( cliente => cliente.id == clienteId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });

            const removido = clientes[ index ];
            clientes.splice( index, 1 );

            await salvarClientes( clientesDataPath, clientes );
            return res.status( 202 ).json({ response: removido });
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },   

    get_cliente: async ( req, res )=>{
        const { clienteId } = req.params;
        if( !clienteId ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clientes = await carregarClientes( clientesDataPath );

            let index = clientes.findIndex( cliente => cliente.id == clienteId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });

            const selecionado = clientes[ index ];            

            await salvarClientes( clientesDataPath, clientes );
            return res.status( 202 ).json({ response: selecionado });
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    }
}