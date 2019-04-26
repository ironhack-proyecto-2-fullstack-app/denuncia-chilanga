const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Denuncia = require("../models/Denuncia");

//middlewares para saber si está logueado:

function aseguraLogueo(req, res, next) {
  if (req.isAuthenticated()) {
    return next(); 
  } else {
    res.redirect('/login')
  }
};

function aseguraDeslogueo(req,res,next){
  if(req.isAuthenticated() == false){
    return next();
  } else {
    res.redirect('/home')
  }
};



// Termina los middlewares
//Para ingresar a los formularios

router.get("/login", aseguraDeslogueo ,(req, res) => {
  res.render("pass/form", { login: true });
});

router.get("/signup", aseguraDeslogueo,(req, res) => {
  res.render("pass/form", { login: false });
});

// Para generar un registro:

router.post("/signup", (req, res) => {
  let { email, password, nombre, apellido, passwordConfirm } = req.body;

  if (password !== passwordConfirm)
    return res.render("pass/form", {
      err: "Las contraseñas no coinciden"
    });

  User.register({ email,nombre,apellido }, password).then(user => {
    res.redirect("/home");
  });
});
// Para iniciar sesion:

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/home",
    failureRedirect: "/login"
  }),
  (req, res) => {
  }
);

// Para cerrar sesión:

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Cuando se loguea, debemos de enviar a la página principal:

router.get("/home",aseguraLogueo, (req, res) => {
var id = req.user.id;

var rol = req.user.rol;
var nombre = req.user.nombre;
var apellido = req.user.apellido;
var denuncias;
var denuncias_semana;
Denuncia.count({user:id})
.then(d =>{
  denuncias = d

  var func = function(){
    if(rol === 'ADMIN'){return {home:true, admin: true ,supervisor:false, ciudadano:false, nombre: nombre, apellido: apellido, rol:rol, id:id, denuncias:denuncias }}
    if(rol === 'SUPERVISOR'){return {home: true, admin: false ,supervisor:true, ciudadano:false, nombre: nombre, apellido: apellido, rol:rol, id:id, denuncias:denuncias}}
    else{return {home:true, admin: false ,supervisor:false, ciudadano:true, nombre: nombre, apellido: apellido, rol:rol, id:id, denuncias:denuncias }}
    }; 
    var user =func();
    console.log(user);
    return res.render("index", user);
})



});

// Para que que si está logueado siempre el home sea el del usuario:


module.exports = router;
