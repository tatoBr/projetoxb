const fs = require( 'fs' );
const fsp = require( 'fs/promises' );
const path = require( 'path' );
const { carregarClientes, salvarClientes } = require( '../util/fileSystemUtil' );

const clientesDataPath = path.join( 'data', 'cliente.json' );

const STATUS_CONTEUDO = { APROVADO: 'Aprovado', EM_ANALISE: 'Em Análise', REPROVADO: "Reprovado" };

module.exports = {    
    post_conteudo: async ( req, res )=>{  
        const { clienteId } = req.params;      
        const { titulo, detalhes } = req.body;
        const idconteudo = Math.floor( Math.random() * 999_999 );

        if([ clienteId, titulo, detalhes ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        try {
            const clientes = await carregarClientes( clientesDataPath );

            const index = clientes.findIndex( cliente => cliente.id == clienteId );
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });

            clientes[ index ].conteudo.push({
                id: idconteudo,
                titulo: titulo,
                descricao: detalhes,
                timeline: [{ data: new Date(), detalhes: `Primeira amostra do conteúdo "${ titulo }" foi criada.`}],
                status: STATUS_CONTEUDO.EM_ANALISE
            });

            const clientesSalvos = await salvarClientes( clientesDataPath, clientes );
            res.status( 200 ).json({ response: clientesSalvos[ index ] });            

        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`})
        }  
    },   

    get_conteudo: async ( req, res ) => {
        const { clienteId, conteudoId } = req.params;       
       
        if([ clienteId, conteudoId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clientes = await carregarClientes( clientesDataPath );

            let cliIndex = clientes.findIndex( cliente => cliente.id == clienteId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clientes[ cliIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.` });
            
            return res.status( 200 ).json({ response: {
                cliente: clientes[ cliIndex ].nome,
                conteudo: clientes[ cliIndex ].conteudo[ contIndex ]
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }     
    },

    update_conteudo: async ( req, res )=>{
        const { clienteId, conteudoId } = req.params
        const { titulo, descricao } = req.body              
       
        if([ clienteId, conteudoId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clientes = await carregarClientes( clientesDataPath );

            let cliIndex = clientes.findIndex( cliente => cliente.id == clienteId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clientes[ cliIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.` });
            
            let conteudoAlterado = 0;
            for( let key in req.body ){
                if( ['titulo', 'descricao', 'status'].includes( key ))
                {
                    if( req.body[ key ] ){
                        clientes[ cliIndex ].conteudo[contIndex][key] = req.body[ key ];
                        conteudoAlterado++
                    }
                }
            }            
            if( conteudoAlterado > 0 ){
                const clientesSalvos = await salvarClientes( clientesDataPath, clientes );
                return res.status( 200 ).json({ response: {
                    cliente: clientesSalvos[ cliIndex ].nome,
                    conteudo: clientesSalvos[ cliIndex ].conteudo[ contIndex ]
                }});            
            }
            else{
                return res.status( 200 ).json({ response: {
                    cliente: clientes[ cliIndex ].nome,
                    conteudo: clientes[ cliIndex ].conteudo[ contIndex ]
                }});
            }
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }      
    },

    delete_conteudo: async ( req, res )=>{
        const { clienteId, conteudoId } = req.params;       
       
        if([ clienteId, conteudoId ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});
        
        try {
            const clientes = await carregarClientes( clientesDataPath );

            let cliIndex = clientes.findIndex( cliente => cliente.id == clienteId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clientes[ cliIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.` });
            
            let removido = clientes[ cliIndex ].conteudo[ contIndex ]            
            clientes[ cliIndex ].conteudo.splice( contIndex, 1 );

            const clientesSalvos = await salvarClientes( clientesDataPath, clientes );
            
            return res.status( 200 ).json({ response: {
                cliente: clientesSalvos[ cliIndex ].nome,
                conteudoRemovido: removido
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }        
    },

    add_to_timeline: async ( req, res ) => {
        const { clienteId, conteudoId } = req.params
        const { detalhes } = req.body;

        try {
            const clientes = await carregarClientes( clientesDataPath );

            let cliIndex = clientes.findIndex( cliente => cliente.id == clienteId );
            if( cliIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.` });
            
            let contIndex = clientes[ cliIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId );
            if( contIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.` });
            
            clientes[cliIndex].conteudo[ contIndex ].timeline.push({ data: new Date(), detalhes: detalhes });

            const clientesSalvos = await salvarClientes( clientesDataPath, clientes );

            return res.status( 200 ).json({ response: {
                cliente: clientesSalvos[ cliIndex ].nome,
                conteudo: clientesSalvos[ cliIndex ].conteudo[ contIndex ]
            }});
            
        } catch ( err ) {
            return res.status( 500 ).json({ response: `${ err.message }`});
        }
    }
}