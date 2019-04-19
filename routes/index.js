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

function createFolio(){
  let folio = 1000;
  return folio++;
}

// termina middleware

/* GET home page */
router.get('/',aseguraDeslogueo, (req, res, next) => {
  res.render('index');
});

router.get('/generar-denuncia', (req, res) => {
   
  Categoria.find().sort({orden:1})
  .then(categorias =>{
  
    res.render('formulario-denuncia', {categorias})
    })
  ;
});

router.post('/generar-denuncia', uploadCloud.array('images'), (req, res) => {
  console.log(req.body);
  console.log(req.files);
  req.body.images = req.files.map(file => file.url);
  Denuncia.create(req.body).then(() => {
    res.redirect('/');
  })
  .catch(err => {
    console.log(`Hubo un error subiendo tu denuncia: ${err}`)
  })
});

module.exports = router;
