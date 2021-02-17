const uuid = require( 'uuid' );
const path = require( 'path' );
const { loadClients, saveClient } = require( '../util/fileSystemUtil' );
const { STATUS_CONTENT } = require( '../util/constants' );

const clientsDataPath = path.join( 'data', 'clients.json' );



module.exports = {    
    postContent: async ( req, res )=>{  
        console.log(req.params)
        const { id: clientId } = req.params;  
        console.log( req.params );    
        const { title, details: descripion } = req.body;
        const idContent = uuid.v4();

        if([ clientId, title, descripion ].includes( undefined )){
            console.table({ clientId, title, descripion });
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        }

        try {
            const clients = await loadClients( clientsDataPath );

            const index = clients.findIndex( client => client.id == clientId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });

            clients[ index ].content.push({
                id: idContent,
                title: title,
                description: descripion,
                timeline: [{ data: new Date(), details: `Primeira amostra do conteúdo "${ title }" foi criada.`}],
                status: STATUS_CONTENT.UNDER_ANALYSIS
            });

            const clientesSalvos = await saveClient( clientsDataPath, clients );
            res.status( 200 ).json({ response: clientesSalvos[ index ] });            

        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`})
        }  
    },   

    getContents: async( req, res ) => {
        const { id: clientId } = req.params;       
       
        if( !clientId )
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clients = await loadClients( clientsDataPath );

            let cliIndex = clients.findIndex( client => client.id == clientId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });
            
            return res.status( 200 ).json({ response: {
                client: clients[ cliIndex ].nome,
                content: clients[ cliIndex ].content 
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }
    },

    getContent: async ( req, res ) => {
        const { id: clienteId, contentId } = req.params;       
       
        if([ clienteId, contentId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clients = await loadClients( clientsDataPath );

            let cliIndex = clients.findIndex( cliente => cliente.id == clienteId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clients[ cliIndex ].content.findIndex( content => content.id == contentId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ contentId } não encontrado.` });
            
            return res.status( 200 ).json({ response: {
                client: clients[ cliIndex ].nome,
                content: clients[ cliIndex ].content[ contIndex ]
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }     
    },

    updateContent: async ( req, res )=>{
        const { id: clientId, contentId } = req.params
        const { title, description } = req.body              
       
        if([ clientId, contentId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clients = await loadClients( clientsDataPath );

            let cliIndex = clients.findIndex( clients => clients.id == clientId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clients[ cliIndex ].content.findIndex( content => content.id == contentId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ contentId } não encontrado.` });
            
            let changedContent = 0;
            for( let key in req.body ){
                if( ['title', 'description', 'status'].includes( key ))
                {
                    if( req.body[ key ] ){
                        clients[ cliIndex ].content[contIndex][key] = req.body[ key ];
                        changedContent++
                    }
                }
            }            
            if( changedContent > 0 ){
                const savedClients = await saveClient( clientsDataPath, clients );
                return res.status( 200 ).json({ response: {
                    client: savedClients[ cliIndex ].name,
                    content: savedClients[ cliIndex ].content[ contIndex ]
                }});            
            }
            else{
                return res.status( 200 ).json({ response: {
                    client: clients[ cliIndex ].name,
                    content: clients[ cliIndex ].content[ contIndex ]
                }});
            }
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }      
    },

    deleteContent: async ( req, res )=>{
        const { id: clientId, contentId } = req.params;       
       
        if([ clientId, contentId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clients = await loadClients( clientsDataPath );

            let cliIndex = clients.findIndex( client => client.id == clientId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });
            
            let contIndex = clients[ cliIndex ].content.findIndex( content => content.id == contentId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ contentId } não encontrado.` });
            
            let removed = clients[ cliIndex ].content[ contIndex ]            
            clients[ cliIndex ].content.splice( contIndex, 1 );

            const savedClients = await saveClient( clientsDataPath, clients );
            
            return res.status( 200 ).json({ response: {
                client: savedClients[ cliIndex ].nome,
                removedContent: removed
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }        
    },

    addToTimeline: async ( req, res ) => {
        const { id: clientId, contentId } = req.params
        const { details } = req.body;

        try {
            const clients = await loadClients( clientsDataPath );

            let cliIndex = clients.findIndex( client => client.id == clientId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clientId } não encontrado.` });
            
            let contIndex = clients[ cliIndex ].content.findIndex( content => content.id == contentId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.` });
            
            clients[cliIndex].content[ contIndex ].timeline.push({ date: new Date(), details: details });

            const savedClients = await saveClient( clientsDataPath, clients );

            return res.status( 200 ).json({ response: {
                cliente: savedClients[ cliIndex ].name,
                conteudo: savedClients[ cliIndex ].content[ contIndex ]
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }
    }
}