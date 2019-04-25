const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");

//Middleware:

function aseguraAdmin(req, res, next) {
  let rol = undefined;
  var validarol = function() {
    if (req.user == undefined) {
      return;
    } else {
      return (rol = req.user.rol);
    }
  };
  validarol();
  if (rol == "ADMIN") {
    return next();
  } else {
    res.redirect("../");
  }
}

//Aquì termina, solo es para asegurarnos que se trata de un administrador el que tiene este acceso

//Para hacer la lista de usuarios:

router.get("/", aseguraAdmin, (req, res) => {
  User.find()
    .then(users => {
      res.render("users", { users });
    })
    .catch(err => {
      console.log(err);
    });
});

// Para editar los usuarios:

router.get("/edit/:id", aseguraAdmin, (req, res) => {
  const { id } = req.params;
  User.findById(id).then(user => {
    res.render("edituser", user);
  });
});

router.post("/edit/:id", aseguraAdmin, (req, res) => {
  const { id } = req.params;
  User.findByIdAndUpdate(id, { $set: { ...req.body } }).then(user => {
    console.log(user);
    res.redirect("/");
  });
});

module.exports = router;
