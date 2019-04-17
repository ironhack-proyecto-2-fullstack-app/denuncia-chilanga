const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const userSchema = new Schema(
  {
  email:{type:String, required:true, unique:true},
  nombre:{type: String, required:true},
  apellido:{type:String, required:true},
  password: String,
  rol:{type: String, required:true, 
    enum:["CIUDADANO", "SUPERVISOR","ADMIN"]
    ,default:"CIUDADANO"}
  },
  { timestamps: true }
);

userSchema.plugin(passportLocalMongoose, {
  usernameField: "email",
  hashField: "password"
});

module.exports = mongoose.model("User", userSchema);