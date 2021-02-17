const  uuid  = require( 'uuid');
const path = require( 'path' );
const { loadClients, saveClient, createDir } = require( '../util/fileSystemUtil' );
const { STATUS_CONTENT } = require( '../util/constants' );

const clientsDataPath = path.join( 'data', 'clients.json' );

module.exports = {
    getClients: async ( req, res )=>{
        try {
            await createDir( 'data' );
            const clients = await loadClients( clientsDataPath );
            res.status( 200 ).json({ response :  clients });
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }            
    },

    postClient: async ( req, res )=>{
        const { name } = req.body;
        const id = uuid.v4();
        let client = { id: id, name: name, content: [], status: STATUS_CONTENT.UNDER_ANALYSIS };

        if( !name ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."})

        try {
            await createDir( 'data' );
            const clients = await loadClients( clientsDataPath );
            clients.push( client );
            const savedClients = await saveClient( clientsDataPath, clients );
            return res.status( 201 ).json({ response: savedClients });

        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },

    updateClient: async ( req, res )=>{
        const { id: clientId } = req.params;
        const { name } = req.body;

        if( [ clientId, name ].includes( undefined )) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clients = await loadClients( clientsDataPath );

            let index = clients.findIndex( cliente => cliente.id == clientId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });

            clients[ index ].name = name;
            await saveClient( clientsDataPath, clients );

            return res.status( 202 ).json({ response: clients[ index ] });

        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },

    deleteClient: async ( req, res )=>{
        const { id: clientId } = req.params;
        if( !clientId ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clients = await loadClients( clientsDataPath );

            let index = clients.findIndex( client => client.id == clientId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });

            const removed = clients[ index ];
            clients.splice( index, 1 );

            await saveClient( clientsDataPath, clients );
            return res.status( 202 ).json({ response: removed });
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    },   

    getClient: async ( req, res )=>{
        const { id:clientId } = req.params;
        if( !clientId ) return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clients = await loadClients( clientsDataPath );

            let index = clients.findIndex( client => client.id == clientId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });

            const selected = clients[ index ];            

            await saveClient( clientsDataPath, clients );
            return res.status( 202 ).json({ response: selected });
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `ERROR: ${ err.message }` });
        }
    }
}