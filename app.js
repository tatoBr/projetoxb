//Importando Core Modules
const path = require('path');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require( 'cors' );

const indexRouter = require('./routes/index');
//const usersRouter = require('./routes/users');
const clientesRouter = require( './routes/clientes' );
const conteudoRouter = require( './routes/conteudo' );

const app = express();

//View engine
app.set( 'view engine', 'ejs' );
app.set( 'views', 'views');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use( cors());

app.use('/', indexRouter);
//app.use('/users', usersRouter);
app.use('/clientes', clientesRouter );
app.use( '/conteudo', conteudoRouter );

module.exports = app;
