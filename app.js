require('dotenv').config();

const bodyParser   = require('body-parser');
const cookieParser = require('cookie-parser');
const express      = require('express');
const favicon      = require('serve-favicon');
const hbs          = require('hbs');
const mongoose     = require('mongoose');
const logger       = require('morgan');
const path         = require('path');
const session      = require("express-session");
const passport     = require("./helpers/passport");

hbs.registerPartials(path.join(__dirname, '/views/partials'))

mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

const app = express();

// Middleware Setup
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// passport and express session setup
app.use(
  session({
    secret: process.env.SECRET,
    cookie: {maxAge: 900000},
    rolling: true,
    saveUninitialized: true,
    resave: true
  })
);
app.use(passport.initialize());
app.use(passport.session());

// Express View engine setup

app.use(require('node-sass-middleware')({
  src:  path.join(__dirname, 'public'),
  dest: path.join(__dirname, 'public'),
  sourceMap: true
}));
      

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));



// default value for title local
app.locals.title = 'DENUNCIA CHILANGA';



const index = require('./routes/index');
app.use('/', index);
const pass = require('./routes/pass');
app.use('/', pass);
const users = require('./routes/users');
app.use('/users', users);
const categoria = require('./routes/categoria');
app.use('/categoria', categoria);
const denuncia = require('./routes/denuncia');
app.use('/denuncia', denuncia);
const graph = require('./routes/graph');
app.use('/graph', graph);
const comentarios = require('./routes/comentarios')
app.use('/comentarios',comentarios);
module.exports = app;