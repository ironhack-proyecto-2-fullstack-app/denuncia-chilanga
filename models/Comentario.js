const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comentarioSchema = new Schema(
  {
    denuncia:{      
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Denuncia"},
    name:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"},
    descripcion:{type: String, unique:true}
  }, {timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}}
);

module.exports = mongoose.model("Comentario", comentarioSchema);

