const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const comentarioSchema = new Schema(
  {
    denuncia:{      
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Denuncia"},
    user:{
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User"},
    comentario:{type: String}
  }, {timestamps: {createdAt: "createdAt", updatedAt: "updatedAt"}}
);

module.exports = mongoose.model("Comentario", comentarioSchema);

