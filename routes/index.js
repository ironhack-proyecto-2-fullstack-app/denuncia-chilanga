const express = require("express");
const router = express.Router();
const User = require("../models/User");
const passport = require("passport");
const Denuncia = require("../models/Denuncia");
const uploadCloud = require("../helpers/cloudinary");
const Categoria = require("../models/Categoria");
const ObjectId = require('mongoose').Types.ObjectId;

//middlewares para saber si está logueado:

function aseguraDeslogueo(req, res, next) {
  if (req.isAuthenticated() == false) {
    return next();
  } else {
    res.redirect("/home");
  }

};

function aseguraLogueo(req, res, next){
  if (req.isAuthenticated()){
    return next()
  } else {
    res.redirect('/login')
  }
}
// termina middleware

//Funcion para poner Fecha:

ponefecha =() =>{
  var year = new Date;
  var mes = new Date;
  var day = new Date;
  var c = year.getFullYear();
  var b = mes.getMonth()+1;
  var a = day.getDate();
  var fecha;
  if ( b < 10 ){b ='0'+b};
  if (a < 10 ){ a = '0'+a};
   fecha = c+'-'+b+'-'+a
return  fecha
};



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
  }
  ;
  
  req.body.user = usr();
  req.body.images = req.files.map(file => file.url);
  const { id } = req.params;
  Denuncia.findOne({})
    .sort({ folio: -1 })
    .limit(1)
    .then(d => {
       req.body.fecha = ponefecha();
      req.body.folio = d.folio + 1;
      console.log(req.body)
      let {titulo, descripcion, lng, lat, categoria, user, images, folio, fecha, direccion} = req.body;
      let img = function (array){
        if (array.length == 0)
        {return ['https://cdn.shopify.com/s/assets/no-image-2048-5e88c1b20e087fb7bbe9a3771824e743c244f437e4f8ba93bbf7b11b53f7824c.gif']} 
        else {return array}
      };

      let denuncia = {
        titulo,
        descripcion,
        categoria,
        ubicacion: {
          type: "Point",
          coordinates: [lng, lat]
        },
        direccion,
        user,
        fecha,
        images: img(req.body.images),
        folio
      };
    
      Denuncia.create(denuncia)
        .then(() => {
          console.log('This is the req.body (index.js routers): ', req.body);
          let folio = req.body.folio;

          res.redirect("/denuncia/" + folio);
        })
        .catch(err => {
          console.log(`Hubo un error subiendo tu denuncia: ${err}`);
        });
    })
    
    .catch(err => {
      req.body.folio = 1;
      req.body.fecha = ponefecha();
      let {titulo, descripcion, lng, lat, categoria, user, images, folio, fecha, direccion} = req.body;
      let denuncia = {
        titulo,
        descripcion,
        ubicacion: {
          type: "Point",
          coordinates: [lng, lat]
        },
        categoria,
        direccion,
        user,
        fecha,
        images,
        folio
      };
      Denuncia.create(denuncia)
        .then(() => {
          res.redirect("/");
        })
        .catch(err => {
          console.log(`Hubo un error subiendo tu denuncia: ${err}`);
        });
    });

});

router.get('/mis-denuncias', (req, res) => {
  res.redirect('/login')
});

router.get('/mis-denuncias/:id', aseguraLogueo, (req, res) => {
  let {id} = req.user._id;
  Denuncia.find({ user: new ObjectId(id) })
    .then( denuncias => {
      res.render('mis-denuncias', {denuncias})
    })
    .catch(err => {
      console.log(`Hubo un error encontrando tus denuncias: ${err}`)
    })
})

// Para el Faveo:

router.post('/faved', async(req, res) => {
  console.log ('Aqui deberia de marcarse el Fav!!!')

  let user = req.user._id
  let url = req.headers.referer;
  let detectaFolio = (url)=>{
    let palabra ='/denuncia/'
    let lugar = url.indexOf(palabra);
    let folio = url.substr(lugar + palabra.length);
    return Number(folio)
    };
  let Usser = String(user);
  let Folio = detectaFolio(url);
  //console.log (user,Folio)

  // Generamos la bùsqueda a la BD:
  Denuncia.aggregate([
    {$match:{ folio: Folio}},
    { $unwind : "$favs" },
    {$match:{ favs: Usser}}
    ])

    .then ( data => {
      console.log('Esta es la bùsqueda :',data, 'Cuenta con', data.length, 'favs ahorita');

      let faveds = data.length;
// Esto es lo que hace si encuentra informaciòn, deberìa de quitarla con un pull:
      var actualizaBD= function(){

        if(faveds !== 0){ 
   return Denuncia.findOneAndUpdate({folio: Folio}, 
          {$pull:{favs: Usser}},
          { multi: true })
          .then(() =>{ //console.log(res)
            res.redirect("/denuncia"+Folio);
          })
            .catch(error =>{
              console.log(error)
            }) 
    }

    if ( faveds ==0){
      return Denuncia.findOneAndUpdate(
        {folio: Folio}, 
        {$push:{favs: Usser}},
        { multi: true }
        ).then(() =>{ //console.log(res)
          //res.redirect("/denuncia"+Folio)
        })
          .catch(error =>{
            console.log(error)
          }) 
    } };

    actualizaBD();
    return res.redirect("/denuncia/"+Folio)
   
  })
  .catch ( err => { 
      
    console.log('no encontró información con ese criterio', err)
        }) 
      });

      router.get("/faved", async(req, res) => {
        
        let url = req.rawHeaders[11];
       let detectaFolio = (url)=>{
          let palabra ='/denuncia/'
          let lugar = url.indexOf(palabra);
          let folio = url.substr(lugar + palabra.length);
          return Number(folio)
          };
        
       let Folio = detectaFolio(url);
        console.log(url, "Folo = ", Folio);
        res.redirect("/denuncia/"+Folio);
      });
module.exports = router;
