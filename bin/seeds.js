const mongoose = require("mongoose");
const User =require ("../models/User");
const passport     = require("../helpers/passport");

mongoose
  .connect(process.env.DB, {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });


  User.register({ nombre: "DOMINGO",apellido:"CARBAJAL", rol: "ADMIN",email:"d.carbajalc@gmail.com" }, '1');
  User.register({ nombre: "TOMAS",apellido:"FREIRE", rol: "ADMIN",email:"tomasfreire@gmail.com" }, '1');
