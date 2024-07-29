const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require("express-session");
const acesso = require('./src/middlewares/middlewares');

const arquivosRouter = require('./src/routes/arquivos');
const loginRoutes = require('./src/routes/login');

require('dotenv').config();

const app = express();

// view engine setup
const mustacheExpress = require("mustache-express");
const engine = mustacheExpress();
app.engine("mustache", engine);

app.set('views', path.join(__dirname, '/src/views'));
app.set('view engine', 'mustache');

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(acesso.estaLogado);
app.use('/arquivos', arquivosRouter);
app.use('/', loginRoutes);


module.exports = app;