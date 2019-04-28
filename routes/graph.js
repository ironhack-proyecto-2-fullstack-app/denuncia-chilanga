const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Denuncia = require("../models/Denuncia");

// Busca en la URL:
const desglosaParametros = 
function(url,nro,dato){
if (url.split('&').length-1 < nro-1){return undefined}
else {
let cadena = url.split('?')[1];
let parametros = cadena.split("&");
let valor = parametros[nro-1].split("=");
return valor [dato]}
};
const devuelveParametro =
function (url, parametro){
  let resultado;
if (url == '/') {return resultado =  undefined}
else {
  parametros = url.split('&').length;
  for (i =1; i<= parametros; i++){
    if(desglosaParametros(url,i,0) == parametro){
    return resultado = desglosaParametros(url,i,1)};
  }}
  return resultado
  };
//
router.get("/", async(req, res) => {
//@parametros:
let url = req.url
let Fi = devuelveParametro(url,'fecha_ini')
let Ff = devuelveParametro(url,'fecha_fin');
let Type = devuelveParametro(url,'graph')
//
  if (url == '/'){
res.render('graph')}
    
else { 
console.log(Fi,Ff,Type);


      Denuncia.aggregate([
        {$match:{fecha: {$gte:Fi,$lte:Ff}}},
        {$group: {_id:"$fecha",total:{$sum:1} }},
        {$sort:{_id: 1} }
        ])
        .then(data =>{
          let graph=true;

          matrizColores = function(number){
            let arreglo = [];
            calculaColor = function(){
              let R = Math.floor((Math.random() * 255) + 1 )
              let G = Math.floor((Math.random() * 255) + 1 )
              let B = Math.floor((Math.random() * 255) + 1 )
              return arreglo.push('rgb('+ String(R)+ ', ' + String(G) + ', ' + String(B) +')')
            };
            for (i = 0; i<number ; i++){
            calculaColor()
            }
            return arreglo
            };

         var   tradTipo = function(){
              if(Type == 'bar'){return 'Barras'};
              if(Type == 'radar'){return 'Radial'};
              if(Type == 'line'){return 'Dispersión'};
              if(Type == 'doughnut'){return 'Dona'};
              if(Type == 'pie'){return 'Pastel'};
            }
        let deftipo = tradTipo();

        var dias = data.reduce((sum, value) => (typeof value.total == "number" ? sum + 1 : sum), 0);

        var color = matrizColores(dias);
          console.log({info:data, type:Type, graph, dias, color,Fi, Ff, deftipo});
        res.render('graph', {info:data, type:Type, graph, dias, color, Fi, Ff, deftipo})
          })
        .catch(err =>{
        console.log(err);
          res.render('graph');
      })
      
      }
    }
    );



module.exports = router;