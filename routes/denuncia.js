const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Categoria = require('../models/Categoria');
const Denuncia = require('../models/Denuncia');



// Estas funciones me dejarán extraer parámetros de la URL, porque no sé porqué no funciona req.params
const desglosaParametros = 
function(url,nro,dato){
if (url.split('&').length-1 < nro-1){return undefined}
else {
let cadena = url.split('?')[1];
let parametros = cadena.split("&");
let valor = parametros[nro-1].split("=");
return valor [dato]}
};
const devuelveParametro =
function (url, parametro){
  let resultado;
if (url == '/') {return resultado =  undefined}
else {
  parametros = url.split('&').length;
  for (i =1; i<= parametros; i++){
    if(desglosaParametros(url,i,0) == parametro){
    return resultado = desglosaParametros(url,i,1)};
  }}
  return resultado
  };

// Terminan funciones para encontrar los parametros en la URL.


router.get("/",async(req,res)=>{
  const url = req.url;
  const Folio = devuelveParametro(url,'folio')
  const Fecha = devuelveParametro(url,'fecha')
  const Category = devuelveParametro(url,'categoria')
  var pagina = 1;

  if (url == '/'){
  Categoria.find().sort({orden:1})
  .then(categorias =>{
    res.render('search', {categorias})
    });}
  else {
    // Buscas por Folio (ignora todo lo demás)
    if(Folio !== undefined){
      Denuncia.findOne({folio: Folio})
      .then(denuncias=>{
        console.log(denuncias);
       return res.render('denuncias', {denuncias, uno:true, Folio})
      })
      
    };
   // Buscas solo por categoria, tiene lo demás apagado
    if (Category !== '*' && Fecha == undefined && Folio == undefined){
      Denuncia.find({categoria: Category})
      .then(denuncias=>{
        console.log(denuncias);
       return res.render('denuncias', {denuncias, uno:false, Folio})
      })};
    // buscas todas las categorías, y tienes todo lo demás apagado:
    if (Category == '*' && Fecha == undefined && Folio == undefined){
       Denuncia.find({}).sort({folio:1})
       .then(denuncias=>{
       console.log(denuncias);
       return res.render('denuncias', {denuncias, uno:false, Folio})
        })};
    // Buscas por una fecha en específico, en todas las categorías:
    if (Category == '*' && Fecha !== undefined && Folio == undefined){
      Denuncia.find({fecha :Fecha}).sort({folio:1})
      .then(denuncias=>{
      console.log(denuncias);
      return res.render('denuncias', {denuncias, uno:false, Folio})
       })};
    // Busca por fecha dentro de solo una categoría:
    if (Category !== '*' && Fecha !== undefined && Folio == undefined){
    Denuncia.find({fecha :Fecha, categoria: Category}).sort({folio:1})
      .then(denuncias=>{
      console.log(denuncias);
      return res.render('denuncias', {denuncias, uno:false, Folio})
      })};

  }
  });

  router.get ('/:Folio',(req,res)=>{
    let{Folio} = req.params;
    Denuncia.findOne({folio: Folio}).populate('user').populate('categoria')
      .then(denuncias=>{
        console.log(denuncias);
       return res.render('denuncia-det', denuncias)
      

  })
});

module.exports = router;