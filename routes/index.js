const express = require('express');
const router  = express.Router();
const User = require("../models/User");
const passport = require("passport");

//middlewares para saber si está logueado:

function aseguraDeslogueo(req,res,next){
  if(req.isAuthenticated() == false){
    return next();
  } else {
    res.redirect('/home')
  }
};
// termina middleware

/* GET home page */
router.get('/',aseguraDeslogueo, (req, res, next) => {
  res.render('index');
});

module.exports = router;
