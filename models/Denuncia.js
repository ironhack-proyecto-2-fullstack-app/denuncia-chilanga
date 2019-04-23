const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const denunciaSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: false,
      ref: "User"
    },
    folio: {
      type: Number,
      required: false,
      unique: true
    },
    titulo: {
      type: String,
      requires: true
    },
    descripcion: String,
    ubicacion: {
      //required:true,
      type: {
        type: String,
        default: "Point"
      },
      // address: {
      //   type: String
      // },
      // colonia: {
      //   type: String
      // },
      coordenadas: {
        type: [Number]
      }
    },
    direccion:String,
    fecha:String,
    images: { type: [String] },
    estatus: {
      type: String,
      required: true,
      enum: ["Abierta", "Cerrada", "En Proceso"],
      default: "Abierta"
    },
    categoria: { type: Schema.Types.ObjectId, required: true, ref: "Categoria" }
  },
  { timestamps: true }
);

denunciaSchema.index({ ubicacion: "2dsphere" });

module.exports = mongoose.model("Denuncia", denunciaSchema);
