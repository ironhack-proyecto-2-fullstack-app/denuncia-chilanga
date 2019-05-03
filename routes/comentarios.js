const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Categoria = require("../models/Categoria");
const Denuncia = require("../models/Denuncia");
const Comentario = require("../models/Comentario");

//ruta para editar comentarios:

router.get("/:id/edit", (req, res) => {
  let {id} = req.params;
  let devUsr=function(){
    if (req.user == undefined){return 0}
    else {return req.user._id}
  }
  let user = devUsr();
console.log(id, user)
  Comentario.findById(id)
    .populate("user")
    .populate("denuncia")
    .then(data => {
console.log(data);
var draw = function(){
  console.log('esta es la data', {data, texto : data.comentario})
if (user == data.user.id){return res.render('comentarioedit',{data})}
else { return res.redirect('/denuncia/'+data.denuncia.folio)}
}
draw();
    });
  });

  router.post("/:id/edit", (req, res) => {
    let {id} = req.params;
    let devUsr=function(){
      if (req.user == undefined){return 0}
      else {return req.user._id}
    }
    let user = devUsr();
  console.log(id, user)
    Comentario.findById(id)
      .populate("user")
      .populate("denuncia")
      .then(data => {
  console.log(data);

  var draw = function(){
    console.log('esta es la data', {data, texto : data.comentario})
  if (user == data.user.id){
  
    return Comentario.findByIdAndUpdate(id,{$set:{...req.body}})
    .then (res.redirect ('/denuncia/'+data.denuncia.folio))
  }
  else { return res.redirect('/denuncia/'+data.denuncia.folio)}
  }
  draw();
      });
    });

  // Para borrar los comentarios:

  router.get("/:id/del", (req, res) => {
    let {id} = req.params;
    let devUsr=function(){
      if (req.user == undefined){return 0}
      else {return req.user._id}
    }
    let user = devUsr();
  console.log(id, user)
    Comentario.findById(id)
      .populate("user")
      .populate("denuncia")
      .then(data => {
  console.log(data);

  var draw = function(){
  
  if (user == data.user.id){
  
    return Comentario.findByIdAndDelete(id)
    .then (res.redirect ('/denuncia/'+data.denuncia.folio))
  }
  else { return res.redirect('/denuncia/'+data.denuncia.folio)}
  }
  draw();
      });
    });
  
  

module.exports = router;