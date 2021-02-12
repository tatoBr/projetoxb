const fs = require( 'fs' );

module.exports = {
    carregarClientes: async function ( path ) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, 'utf-8', ( readErr, data ) => {
                if ( !readErr ) {                    
                    let parsedData = null;
                    try { parsedData = JSON.parse(data);}
                    catch ( parseErr ) { parsedData = [];}                    
                    return resolve( parsedData );
                }
                else if ( readErr.code === 'ENOENT') return resolve([])
                else return reject( readErr );
            })
        })
    },
    salvarClientes: async function (path, clientes) {
        return new Promise((resolve, reject) => {
            fs.writeFile(path, JSON.stringify(clientes), 'utf-8', err => {
                if (!err) return resolve(clientes);
                reject(err);
            })
        });
    },
    criarDiretorio: async function ( path ){
        if( !fs.existsSync( path )){
            return new Promise(( resolve, reject )=>{
                fs.mkdir( path, err => {
                    if( err ) return reject( err );
                    return resolve(console.log( 'Diretório criado com sucesso.' ));
                })
            })
        }
        return 0;
    }
}
