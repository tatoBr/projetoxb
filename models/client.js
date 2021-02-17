const path = require( 'path' );
const uuid = require('uuid');
const Content = require( '../models/content');
const dataMananger = require( '../util/fileSystemUtil' );
const dbPath = path.join( 'data', 'clients.json' );

class Client{
    constructor( name ){
        this.id = uuid.v4();
        this.name = name;
        this.content = [];
    }

    set name( name ){
        name.trim();
        if( !name ) return;
        this.name = name;
    }

    /**
     * add a new content to the content array
     * @param { Content } content 
     */
    // addContent = ( content )=>{
    //     if( !conten instanceof Content ) return;
    //     this.content.push( content );
    // };

    save = async () => {
        const clients = await dataMananger.loadClients( dbPath );
        clients.push( this );
        await dataMananger.saveClient( dbPath, clients );        
    };
}

module.exports = Client;