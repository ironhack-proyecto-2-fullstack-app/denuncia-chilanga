const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Denuncia = require('../models/Denuncia');
const uploadCloud = require('../helpers/cloudinary');
const Categoria = require('../models/Categoria')

//middlewares para saber si está logueado:

function aseguraDeslogueo(req,res,next){
  if(req.isAuthenticated() == false){
    return next();
  } else {
    res.redirect('/home')
  }
};
// termina middleware

//Funcion para poner Fecha:

ponefecha =() =>{
  var year = new Date;
  var mes = new Date;
  var day = new Date;
  var c = year.getFullYear();
  var b = mes.getMonth()+1;
  var a = day.getDate();
  var fecha;
  if ( b < 10 ){b ='0'+b};
  if (a < 10 ){ a = '0'+a};
   fecha = c+'-'+b+'-'+a
return  fecha
};


/* GET home page */
router.get('/',aseguraDeslogueo, (req, res, next) => {
  res.render('index');
});

router.get('/generar-denuncia', (req, res) => {
  Categoria.find().sort({orden:1})
  .then(categorias =>{
    res.render('formulario-denuncia', {categorias})
    })
      ;});

router.post('/generar-denuncia', uploadCloud.array('images'), (req, res) => {
  
  let usr = () =>{
    if(req.user == undefined){return null}
    else {return req.user.id}
  };
  req.body.fecha = ponefecha();
  req.body.user = usr();
  req.body.images = req.files.map(file => file.url);
  const {id} = req.params
 Denuncia.findOne({}).sort({folio:-1}).limit(1)
.then(d => { req.body.folio = d.folio + 1; 

Denuncia.create(req.body).then(() => {
  console.log(req.body);
  let folio = req.body.folio;
  
    res.redirect('/denuncias/'+folio);
})
.catch(err => {console.log(`Hubo un error subiendo tu denuncia: ${err}`)})
})
.catch (err => { req.body.folio = 1; 
  Denuncia.create(req.body).then(() => {
    res.redirect('/');
})
.catch(err => {console.log(`Hubo un error subiendo tu denuncia: ${err}`)})
})
});

module.exports = router;
