const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Categoria = require('../models/Categoria')
const passport = require("passport");

//Middleware:

function aseguraAdmin(req,res,next){
  let rol = undefined;
  var validarol=function(){
    if(req.user == undefined) {return}
    else {return rol = req.user.rol}
  };
  validarol();
  if (rol == 'ADMIN'){return next()}
  else{ res.redirect('../')}  
}

//Aquì termina, solo es para asegurarnos que se trata de un administrador el que tiene este acceso

//Para hacer la lista de categorias:

router.get("/",aseguraAdmin,(req,res)=>{
  Categoria.find().sort({orden:1})
.then(categorias =>{
res.render("categorias", {categorias});
})
.catch(err=>{
console.log(err);
})
});

// Para editar las categorias:

router.get("/edit/:id", aseguraAdmin, (req,res)=>{
  const {id} = req.params;
  Categoria.findById(id)
  .then((categorias)=>{
    res.render("newcategory", categorias)
  })
})

router.post("/edit/:id",aseguraAdmin,(req,res) =>{
  const {id} = req.params;
   Categoria.findByIdAndUpdate(id,{$set:{...req.body}}) 
   .then(categorias =>{
     console.log(categorias)
     res.redirect('/categoria')
   })
 });
//Para el acceso a crear categorias:
router.get("/new",aseguraAdmin, (req, res) => {
  res.render("newcategory");
});
// para el guardado de un nuevo curso:
router.post("/new",aseguraAdmin,(req,res)=>{
  Categoria.create(req.body)
  .then(()=>{
  res.redirect("/categoria")})
  .catch(err=>{
      console.log(err)
  })
  });



module.exports = router;
