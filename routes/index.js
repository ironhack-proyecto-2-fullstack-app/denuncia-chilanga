const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Denuncia = require("../models/Denuncia");
const uploadCloud = require("../helpers/cloudinary");
const Categoria = require("../models/Categoria");

//middlewares para saber si está logueado:

function aseguraDeslogueo(req, res, next) {
  if (req.isAuthenticated() == false) {
    return next();
  } else {
    res.redirect("/home");
  }
}

// termina middleware;

/* GET home page */
router.get("/", aseguraDeslogueo, (req, res, next) => {
  res.render("index");
});

router.get("/generar-denuncia", (req, res) => {
  Categoria.find()
    .sort({ orden: 1 })
    .then(categorias => {
      res.render("formulario-denuncia", { categorias });
    });
});

router.post("/generar-denuncia", uploadCloud.array("images"), (req, res) => {
  let usr = () => {
    if (req.user == undefined) {
      return null;
    } else {
      return req.user.id;
    }
  };

  req.body.user = usr();
  req.body.images = req.files.map(file => file.url);
  const { id } = req.params;
  Denuncia.findOne({})
    .sort({ folio: -1 })
    .limit(1)
    .then(d => {
      req.body.folio = d.folio + 1;
      let {titulo, descripcion, lng, lat, categoria, user, images, folio} = req.body;
      let denuncia = {
        titulo,
        descripcion,
        ubicacion: {
          type: "Point",
          coordenadas: [lng, lat]
        },
        categoria,
        user,
        images,
        folio
      }


      Denuncia.create(denuncia)
        .then(() => {
          console.log('This is the req.body: ', req.body);
          let folio = req.body.folio;

          res.redirect("/denuncias/" + folio);
        })
        .catch(err => {
          console.log(`Hubo un error subiendo tu denuncia: ${err}`);
        });
    })
    .catch(err => {
      req.body.folio = 1;
      Denuncia.create(req.body)
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          console.log(`Hubo un error subiendo tu denuncia: ${err}`);
        });
    });
});

module.exports = router;
