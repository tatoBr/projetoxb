const { F_OK } = require('constants');
const fsp = require( 'fs/promises' );


module.exports = {
    carregarClientes: async function ( path ) {
        try {
            const data = await fsp.readFile( path, 'utf-8' );
            const parsedData = JSON.parse( data );
            return parsedData;
        } catch (error) {
            if( error.code === 'ENOENT') return [];
            else throw error;
        }
    },

    salvarClientes: async function (path, clientes) {
        try {
            await fsp.writeFile( path, JSON.stringify( clientes ), 'utf-8' );
            return clientes;
        } catch (error) {
            throw error;            
        }
    },

    criarDiretorio: async function ( path ){
        try {
            await fsp.access( 'data', F_OK );
            return console.log( 'Diretório já existe.')
           
        } catch (error) {
            if( error.code === 'ENOENT'){                
                await fsp.mkdir( 'data'); 
                return console.log( 'Diretório foi criado.')           
            }
            else
                throw error;
        }
    }
}
