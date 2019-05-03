const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Categoria = require("../models/Categoria");
const Denuncia = require("../models/Denuncia");
const Comentario = require("../models/Comentario");

// Estas funciones me dejarán extraer parámetros de la URL, porque no sé porqué no funciona req.params

const desglosaParametros = function(url, nro, dato) {
  if (url.split("&").length - 1 < nro - 1) {
    return undefined;
  } else {
    let cadena = url.split("?")[1];
    let parametros = cadena.split("&");
    let valor = parametros[nro - 1].split("=");
    return valor[dato];
  }
};
const devuelveParametro = function(url, parametro) {
  let resultado;
  if (url == "/") {
    return (resultado = undefined);
  } else {
    parametros = url.split("&").length;
    for (i = 1; i <= parametros; i++) {
      if (desglosaParametros(url, i, 0) == parametro) {
        return (resultado = desglosaParametros(url, i, 1));
      }
    }
  }
  return resultado;
};

// Terminan funciones para encontrar los parametros en la URL.
// middlewares:

function aseguraLogueo(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}
function aseguraDeslogueo(req, res, next) {
  if (req.isAuthenticated() == false) {
    return next();
  } else {
    res.redirect("/home");
  }
}

// terminan los middlewares

router.get("/", async (req, res) => {
  const url = req.url;
  const Folio = devuelveParametro(url, "folio");
  const Fecha = devuelveParametro(url, "fecha");
  const Category = devuelveParametro(url, "categoria");

  if (url == "/") {
    Categoria.find()
      .sort({ orden: 1 })
      .then(categorias => {
        res.render("search", { categorias });
      });
  } else {
    // Buscas por Folio (ignora todo lo demás)
    if (Folio !== undefined) {
      Denuncia.find({ folio: Folio }).then(denuncias => {
        console.log(denuncias);
        res.render("denuncias", { denuncias, uno: true, Folio });
      });
    }
    // Buscas solo por categoria, tiene lo demás apagado
    if (Category !== "*" && Fecha == undefined && Folio == undefined) {
      Denuncia.find({ categoria: Category }).then(denuncias => {
        console.log(denuncias);
        return res.render("denuncias", { denuncias, uno: false, Folio });
      });
    }
    // buscas todas las categorías, y tienes todo lo demás apagado:
    if (Category == "*" && Fecha == undefined && Folio == undefined) {
      Denuncia.find({})
        .sort({ folio: 1 })
        .then(denuncias => {
          console.log(denuncias);
          return res.render("denuncias", { denuncias, uno: false, Folio });
        });
    }
    // Buscas por una fecha en específico, en todas las categorías:
    if (Category == "*" && Fecha !== undefined && Folio == undefined) {
      Denuncia.find({ fecha: Fecha })
        .sort({ folio: 1 })
        .then(denuncias => {
          console.log(denuncias);
          return res.render("denuncias", { denuncias, uno: false, Folio });
        });
    }
    // Busca por fecha dentro de solo una categoría:
    if (Category !== "*" && Fecha !== undefined && Folio == undefined) {
      Denuncia.find({ fecha: Fecha, categoria: Category })
        .sort({ folio: 1 })
        .then(denuncias => {
          //console.log(denuncias);
          return res.render("mis-denuncias", { denuncias, uno: false, Folio, faveds });
        });
    }
  }
  });

  router.get ('/:Folio',async(req,res)=>{
    //console.log(req.params, req.url)
    let{Folio} = req.params;
    Denuncia.findOne({folio: Folio}).populate('user').populate('categoria')
      .then(denuncias=>{
        let usr= denuncias.user;
        let ubicacion = denuncias.ubicacion;
        let images = denuncias.images;
        let estatus=denuncias.estatus;
        let _id = denuncias._id;
        let titulo = denuncias.titulo;
        let descripcion = denuncias.descripcion;
        let categoria = denuncias.categoria;
        let fecha = denuncias.fecha;
        let folio = denuncias.folio;
        let faveds = denuncias.favs.length;
        let direccion = denuncias.direccion;
        
        let detectaUser = function (){
          if (req.user == undefined){return 0}
          else {return req.user._id}
        };

        let found = denuncias.favs.find(function(element) {
          return element == detectaUser();
        });

        let indicafaved = function(){
          if (found == undefined){return false}
          else {return true}
        };

        let isFaved = indicafaved();
        console.log('tu usuario es', detectaUser())
        console.log('El arreglo en el que buscas es:', denuncias.favs);
        console.log('la conicidencia es:',found);
        let log = function (){
          if (req.isAuthenticated()){return true}
          else {return false}
        };
        let logged = log()
        var data ={user:usr, ubicacion: ubicacion, images:images, estatus:estatus,_id: _id, titulo:titulo, 
          descripcion:descripcion,categoria:categoria,fecha:fecha, folio:folio, logged, faveds, isFaved, direccion: direccion };
  
        Comentario.find({denuncia:_id}).populate('user').sort({createdAt:1})
        .then ( comentarios=>{
 
          let detectaUsuario = function (){
            if (req.user == undefined){return 0}
            else {return req.user._id}
          };

          let logueado = detectaUsuario();
          var inter = comentarios;

          var poneEditable = function(array, logueado) {
            let arreglo = array;
            let usuario = logueado;

            let largo = arreglo.length;
            let detecta = function(n) {
              console.log(n, String(arreglo[n].user._id), String(usuario));
              if (String(arreglo[n].user._id) !== String(usuario)) {
                return (arreglo[n].edit = false);
              } else {
                return (arreglo[n].edit = true);
              }
            };
            for (i = 0; i < largo; i++) {
              detecta(i);
            }
            return arreglo;
          };
          //let coment = comentarios;
          let coment = poneEditable(inter, logueado);
          console.log(coment[0].user, coment[0].edit, coment[0]);
          data = {
            user: usr,
            ubicacion: ubicacion,
            direccion: direccion,
            images: images,
            estatus: estatus,
            _id: _id,
            titulo: titulo,
            descripcion: descripcion,
            categoria: categoria,
            fecha: fecha,
            folio: folio,
            logged,
            comentarios: coment,
            logueado,
            faveds,
            isFaved
          };

          res.render("denuncia-det", data);
        })
        .catch(err => {
          console.log("no tiene comentarios", err);
          res.render("denuncia-det", data);
        });
      console.log(data);
      // res.render('denuncia-det', data)
    });
});

router.post("/:Folio", aseguraLogueo, (req, res) => {
  console.log(req.params, req.url);
  let { Folio } = req.params;
  let user = req.user;

  Denuncia.findOne({ folio: Folio })
    .populate("user")
    .populate("categoria")
    .then(denuncias => {
      let author = req.user._id;
      let denuncia = denuncias._id;
      let { comentario } = req.body;
      let datos = { user: author, denuncia: denuncia, comentario: comentario };
      console.log(datos);
      Comentario.create(datos).then(() => {
        res.redirect("/denuncia/" + Folio);
      });
    });
});



module.exports = router;
