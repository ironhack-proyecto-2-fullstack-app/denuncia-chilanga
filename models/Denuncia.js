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
      required: true
    },
    descripcion: String,
    ubicacion: {
      //required:true,
      type: {
        type: String,
        default: "Point"
      },
      address: {
        type: String
      },
      // colonia: {
      //   type: String
      // },
      coordinates: {
        type: [Number]
      }
    },
    direccion: String,
    fecha: String,
    images: { type: Array, 
      default : ["https://cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif"]
    },
    estatus: {
      type: String,
      required: true,
      enum: ["Abierta", "Rechazada", "Completada", "En Proceso"],
      default: "Abierta"
    },
    favs : [String],
    categoria: { type: Schema.Types.ObjectId, required: true, ref: "Categoria" }
  },
  { timestamps: true }
);

denunciaSchema.index({ ubicacion: "2dsphere" });

module.exports = mongoose.model("Denuncia", denunciaSchema);
