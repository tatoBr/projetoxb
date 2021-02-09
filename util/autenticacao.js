//importando Core modules
const fs = require( 'fs' );
const path = require( 'path' );

//declarando globais
const userDataPath = path.join( 'data', 'users.json' );

module.exports = {    
    autenticar: ( req, res, next )=>{
        const { usuario, senha } = req.body;    
                
        fs.readFile( userDataPath, 'UTF8', ( readErr, data )=>{
            if( !readErr ){
                const users =  JSON.parse( data );
                let loggedUser = users.find( user.login === usuario && user.senha === senha );

                if( loggedUser ){
                    req.setHeader( 'Authorization', `authorized_${ loggeduser.permissao }`);
                    next();
                }
                else{
                    res.status( 401 ).render( 'index', {
                        title: "Erro de autenticação.",
                        loginError: true
                    });
                }                                
            }
            else{
                res.status( 500 ).send( err.message );
            }
        });        
    }
}