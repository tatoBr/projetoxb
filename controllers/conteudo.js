const fs = require( 'fs' );
const fsp = require( 'fs/promises' );
const path = require( 'path' );
const clientesDataPath = path.join( 'data', 'cliente.json' );

const STATUS_CONTEUDO = { APROVADO: 'Aprovado', EM_ANALISE: 'Em Análise', REPROVADO: "Reprovado" };

module.exports = {    
    post_conteudo: async ( req, res )=>{  
        const { clienteId } = req.params;      
        const { titulo, detalhes } = req.body;
        const idconteudo = Math.floor( Math.random() * 999_999 );

        if([ clienteId, titulo, detalhes ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        fsp.readFile( clientesDataPath, 'utf-8')
        .then( data => {
            let clientes = null

            try { clientes = JSON.parse( data ) }
            catch ( err ) { clientes = [] }

            if( !Array.isArray( clientes )) clientes = [];

            const index = clientes.findIndex( cliente => cliente.id == clienteId )
            if( index < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ cliente_id } não encontrado.` })

            clientes[ index ].conteudo.push({
                id: idconteudo,
                titulo: titulo,
                descricao: detalhes,
                timeline: [{ data: new Date(), detalhes: `Primeira amostra do conteúdo ${ titulo } foi criada.`}],

                status: STATUS_CONTEUDO.EM_ANALISE
            });
            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ), 'utf-8' )
            .then(()=> res.status( 201 ).redirect( '/clientes' ))
            .catch( err => res.status( 500 ).json({ response: `Erro salvando arquivo: ${ err.message }`}))
        })
        .catch( err => res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`}));        
    },   

    get_conteudo: ( req, res ) => {
        const { clienteId, conteudoId } = req.params       

        fsp.readFile( clientesDataPath, 'utf-8')
        .then( data => {
            let clientes = null;
            
            try { clientes = JSON.parse( data )}
            catch ( err ) { clientes= []}

            if( !Array.isArray( clientes )) clientes = []

            const clienteIndex = clientes.findIndex( cliente => cliente.id == clienteId );            
            if( clienteIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.`});

            const conteudoIndex = clientes[ clienteIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId )
            if( conteudoIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.`});

            return res.status( 200 ).json({ 
                responde: {
                    id: clientes[ clienteIndex ].id,
                    cliente: clientes[ clienteIndex ].nome,
                    conteudo: clientes[ clienteIndex ].conteudo[ conteudoIndex ] || null
                }
            });
        })
        .catch( err => res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`}));        
    },

    update_conteudo: async ( req, res )=>{
        const { clienteId, conteudoId } = req.params
        const { titulo, descricao } = req.body

        if( [clienteId, conteudoId, titulo, descricao ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            let clientes = null;
            
            try { clientes = JSON.parse( data )}
            catch ( err ) { clientes= []}

            if( !Array.isArray( clientes )) clientes = [];

            const clienteIndex = clientes.findIndex( cliente => cliente.id == clienteId );            
            if( clienteIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.`});

            const conteudoIndex = clientes[ clienteIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId )
            if( conteudoIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.`});

            clientes[clienteIndex].conteudo[ conteudoIndex ].titulo = titulo;
            clientes[clienteIndex].conteudo[ conteudoIndex ].descricao = descricao;

            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ), 'utf-8' )
            .then(() => res.status( 202 ).redirect( `/clientes/detalhes/${ clienteId }` ))
            .catch(  err => res.status( 500 ).json({ response: `Erro ao salvar arquivo: ${ err.message }`}))
        })
        .catch(  err => res.status( 500 ).json({ response: `Erro ao Ler arquivo: ${ err.message }`}))        
    },

    delete_conteudo: ( req, res )=>{
        const { clienteId, conteudoId } = req.params;
        fsp.readFile( clientesDataPath, 'utf-8')
        .then( data => {
            let clientes = null;
            
            try { clientes = JSON.parse( data )}
            catch ( err ) { clientes= []}

            if( !Array.isArray( clientes )) clientes = [];

            const clienteIndex = clientes.findIndex( cliente => cliente.id == clienteId );            
            if( clienteIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.`});

            const conteudoIndex = clientes[ clienteIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId )
            if( conteudoIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.`});

            clientes[clienteIndex].conteudo.splice( conteudoIndex, 1 );
            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ), 'utf-8')
            .then(() => res.status( 202 ).json({ response: clientes }))
            .catch( err => res.status( 500 ).json({ response: `Erro ao salvar arquivo: ${ err.message }`}))
        })
        .catch( err => res.status( 500 ).json({ response: `Erro ao ler arquivo: ${ err.message }`}))
    },

    add_to_timeline: async ( req, res ) => {
        const { clienteId, conteudoId } = req.params
        const { detalhes } = req.body;

        if( [ clienteId, conteudoId, detalhes ].includes( undefined ))
            return res.status( 400 ).json({ response:"Existem dados inválidos na sua requisição."});

        fsp.readFile( clientesDataPath, 'utf-8' )
        .then( data => {
            let clientes = null;
            
            try { clientes = JSON.parse( data )}
            catch ( err ) { clientes= []}

            if( !Array.isArray( clientes )) clientes = [];

            const clienteIndex = clientes.findIndex( cliente => cliente.id == clienteId );            
            if( clienteIndex < 0 ) return res.status( 404 ).json({ response: `Cliente com id ${ clienteId } não encontrado.`});

            const conteudoIndex = clientes[ clienteIndex ].conteudo.findIndex( conteudo => conteudo.id == conteudoId )
            if( conteudoIndex < 0 ) return res.status( 404 ).json({ response: `Conteúdo com id ${ conteudoId } não encontrado.`});

            clientes[clienteIndex].conteudo[ conteudoIndex ].timeline.push({ data: new Date(), detalhes: detalhes });           

            fsp.writeFile( clientesDataPath, JSON.stringify( clientes ), 'utf-8' )
            .then(() => res.status( 202 ).redirect( `/clientes/detalhes/${ clienteId }` ))
            .catch(  err => res.status( 500 ).json({ response: `Erro ao salvar arquivo: ${ err.message }`}))
        })
        .catch(  err => res.status( 500 ).json({ response: `Erro ao Ler arquivo: ${ err.message }`}))
    }
}