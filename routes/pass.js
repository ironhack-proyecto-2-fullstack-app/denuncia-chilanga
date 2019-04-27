const express = require("express");
var Chart = require('chart.js');
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Recaptcha = require("express-recaptcha").RecaptchaV2;
const recaptcha = new Recaptcha(
  process.env.RECAPTCHA_SITE_KEY,
  process.env.RECAPTCHA_SECRET_KEY
);
const Denuncia = require("../models/Denuncia");
//funcion dias:
var sumaDias = function(aa,bb){
  let dateOffset = (24*60*60*1000) * bb;
  let myDate = new Date(aa);
   myDate.setTime(myDate.getTime() + dateOffset);
    var year = new Date(myDate);
    var mes = new Date(myDate);
    var day = new Date(myDate);
    var c = year.getFullYear();
    var b = mes.getMonth()+1;
    var a = day.getDate();
    var fecha;
    if ( b < 10 ){b ='0'+b};
    if (a < 10 ){ a = '0'+a};
     fecha = c+'-'+b+'-'+a
  return  fecha
  };

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
//middlewares para saber si está logueado:

function aseguraLogueo(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function aseguraDeslogueo(req, res, next) {
  if (req.isAuthenticated() == false) {
    return next();
  } else {
    res.redirect("/home");
  }
}

// Termina los middlewares
//Para ingresar a los formularios

router.get("/login", aseguraDeslogueo, (req, res) => {
  res.render("pass/form", { login: true });
});

router.get("/signup", aseguraDeslogueo, (req, res) => {
  res.render("pass/form", { login: false });
});

// Para generar un registro:

router.post("/signup", (req, res) => {
  let { email, password, nombre, apellido, passwordConfirm } = req.body;

  if (password !== passwordConfirm)
    return res.render("pass/form", {
      err: "Las contraseñas no coinciden"
    });

  User.register({ email, nombre, apellido }, password).then(user => {
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
  (req, res) => {}
);

// Para cerrar sesión:

router.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

// Cuando se loguea, debemos de enviar a la página principal:

router.get("/home", aseguraLogueo, (req, res) => {
  var rol = req.user.rol;
  var nombre = req.user.nombre;
  var apellido = req.user.apellido;
  var id = req.user._id;
  var func = function() {
    if (rol === "ADMIN") {
      return {
        home: true,
        admin: true,
        supervisor: false,
        ciudadano: false,
        id,
        nombre,
        apellido,
        rol
      };
    }
    if (rol === "SUPERVISOR") {
      return {
        home: true,
        admin: false,
        supervisor: true,
        ciudadano: false,
        id,
        nombre,
        apellido,
        rol
      };
    } else {
      return {
        home: true,
        admin: false,
        supervisor: false,
        ciudadano: true,
        id,
        nombre,
        apellido,
        rol
      };
    }
  };

  var user = func();

  var hoy = ponefecha();
  var uno = sumaDias(hoy,0);
  var dos = sumaDias(hoy,-1);
  var tres = sumaDias(hoy,-2);
  var cuatro = sumaDias(hoy,-3);
  var cinco = sumaDias(hoy,-4);
  var seis = sumaDias(hoy,-5);
  
  
Denuncia.aggregate([
  {$match:{user:id}},
  {$group: {_id:"$fecha",total:{$sum:1} }}
]). then(data =>{

var totales = data.reduce((sum, value) => (typeof value.total == "number" ? sum + value.total : sum), 0);

var sem = function (data, n){
 if ( data.filter(dat => dat._id == n).length >= 1) { return data.filter(dat => dat._id == n)[0].total }
 else {return 0}
};



var semana=  [{fecha:hoy, denuncias: sem(data,hoy)},
              {fecha: uno, denuncias: sem (data,uno)},
              {fecha: dos, denuncias: sem (data,dos)},
              {fecha: tres, denuncias: sem(data,tres)},
              {fecha: cuatro, denuncias: sem (data,cuatro)},
              {fecha: cinco, denuncias: sem (data,cinco)},
              {fecha: seis, denuncias: sem (data,seis)}
]

var funcColor = function(number){
  if(number < 5){return 'rgb(76, 255, 51)'}
  if(number >= 6 && number < 10){return 'rgb(252, 255, 51)'}
  else {return 'rgb(255, 99, 132)'}
};



var total_sem = semana.reduce((sum, value) => (typeof value.denuncias == "number" ? sum + value.denuncias : sum), 0);

var color_graph = funcColor(total_sem);

var fechas =[hoy,uno,dos,tres,cuatro, cinco, seis];
var vals = [sem(data,hoy), sem(data,uno), sem(data,dos), sem(data,tres), sem(data,cuatro), sem(data,cinco), sem(data,seis)]          

let gdata = {fechas,vals};
console.log({data, user,totales, semana, fechas, vals, total_sem, color_graph})
  return res.render("index", {data, user,totales, sem: semana, fechas ,gdata,vals, total_sem, color_graph})
})

.catch(err=>{
  console.log(err)
})
});
module.exports = router;
