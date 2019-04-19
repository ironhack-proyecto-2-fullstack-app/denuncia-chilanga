const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const categoriaSchema = new Schema(
  {
    orden: Number,
    descripcion:{type: String, unique: true}
  }
);

module.exports = mongoose.model("Categoria", categoriaSchema);

