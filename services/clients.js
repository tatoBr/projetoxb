const path = require( 'path' );
const dataMananger = require('../util/fileSystemUtil');
const Client = require( '../models/client' );
const dbPath = path.join( 'data', 'clients.json' );

class ClientServices{
    saveClients = async ( data )=>
    {
        try {            
            await dataMananger.createDir( dbPath );    
            const { name } = data;

            if( !name ){
                return {
                    message: 'Invalid input',
                    content: null
                }
            }
            const client = new Client( name );
            await client.save();  
            return {
                message: 'client saved',
                content: client
            } 
        } catch (error) {
            return {
                message: error.message,
                content: error
            }
        }             
    };

    loadClients = async ()=>{
        //ToDo
    };
}

module.exports = ClientServices;