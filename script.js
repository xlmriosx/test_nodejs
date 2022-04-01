// const http = require('http');

// const hostname = '127.0.0.1';
// const port = 3000;

// const server = http.createServer((req, res) => {
//   res.statusCode = 200;
//   res.setHeader('Content-Type', 'text/plain');
//   res.end('Hello World');
// });

// server.listen(port, hostname, () => {
//   console.log(`Server running at http://${hostname}:${port}/`);
// });

var express = require('express');
var bodyParser = require('body-parser'); 
var mysql = require('mysql');
var oApp = express(); 
oApp.use(bodyParser.json());
oApp.use(bodyParser.urlencoded({ extended: true })); 
var oMyConnection = mysql.createConnection({
   host: '127.0.0.1',
   user: 'root',
   password: '1234',
     database: 'aalmunia_tests'   
});
oApp.get('/gato', function(oReq, oRes) {
   var sSQLGetAll = "SELECT * FROM gato";
   oMyConnection.query(sSQLGetAll, function(oError, oRows, oCols) {
     if(oError) {
       oRes.write(JSON.stringify({
         error: true,
         error_object: oError         
       }));
       oRes.end();
     } else {
       oRes.write(JSON.stringify(oRows));
       oRes.end();       
     }
   });
});
 
function CreateGATO(oDataGATO, oResponse) {  
  var sSQLCreate = "INSERT INTO gato (id_gato, nombre, raza, color, edad, peso, last_updated) VALUES (NULL, ";
  sSQLCreate += "'" + oDataGATO.nombre + "', ";
  sSQLCreate += "'" + oDataGATO.raza + "', ";
  sSQLCreate += "'" + oDataGATO.color + "', ";
  sSQLCreate += "'" + oDataGATO.edad + "', ";
  sSQLCreate += "'" + oDataGATO.peso + "', ";
  sSQLCreate += "NOW())";
    
  oMyConnection.query(sSQLCreate, function(oError, oRows, oCols) {
    if(oError) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oError
      }));
      oResponse.end();      
    } else {
      var iIDCreated = oRows.insertId;
      oResponse.write(JSON.stringify({
        error: false,
        idCreated: iIDCreated
      }));
      oResponse.end();      
    }    
  });
} 
 
function ReadGATO(oResponse) {
  var sSQLRead = "SELECT * FROM gato";
  oMyConnection.query(sSQLRead, function(oError, oRows, oCols) {
    if(oError) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oError
      }));
      oResponse.end();
    } else {
      oResponse.write(JSON.stringify({
        error: false,
        data: oRows
      }));
      oResponse.end();            
    }    
  });    
}
function UpdateGATO(oDataGATO, oResponse) {
  var sSQLUpdate = "UPDATE gato SET last_updated = NOW() ";
  if(oDataGATO.hasOwnProperty('nombre')) {
    sSQLUpdate += " AND nombre = '" + oDataGATO.nombre + "' ";
  }
  if(oDataGATO.hasOwnProperty('raza')) {
    sSQLUpdate += " AND raza = '" + oDataGATO.raza + "' ";
  }
  if(oDataGATO.hasOwnProperty('color')) {
    sSQLUpdate += " AND color = '" + oDataGATO.color + "' ";
  }
  if(oDataGATO.hasOwnProperty('edad')) {
    sSQLUpdate += " AND edad = '" + oDataGATO.edad + "' ";
  }
  if(oDataGATO.hasOwnProperty('peso')) {
    sSQLUpdate += " AND peso = '" + oDataGATO.peso + "' ";    
  }    
  sSQLUpdate = " WHERE idgato = '" + oDataGATO.idgato + "'";
  
  oMyConnection.query(sSQLUpdate, function(oErrUpdate, oRowsUpdate, oColsUpdate) {
    if(oErrUpdate) {
      oResponse.write(JSON.stringify({ 
        error: true,
        error_object: oErrUpdate
      }));
      oResponse.end();      
    } else {
      oResponse.write(JSON.stringify({
        error: false
      }));
      oResponse.end();
    }
  });
}
function DeleteGATO(oDataGATO, oResponse) {
  var sSQLDelete = "DELETE FROM gato WHERE idgato = '" + oDataGATO.idgato + "'";
  oMyConnection.query(sSQLDelete, function(oErrDelete, oRowsDelete, oColsDelete) {
    if(oErrDelete) {
      oResponse.write(JSON.stringify({
        error: true,
        error_object: oErrDelete
      }));
      oResponse.end();
    } else {
      oResponse.write(JSON.stringify({
        error: false
      }));
      oResponse.end();      
    }    
  });  
}
 
 oApp.post('/gato', function(oReq, oRes) {
   var oDataOP = {};
   var sOP = '';
   
   oDataOP = oReq.body.data_op;
   sOP = oReq.body.op;
   
   switch(sOP) {
     
     case 'CREATE':      
      CreateGATO(oDataOP, oRes);
     break;
     
     case 'READ':
      ReadGATO(oRes);
     break;
     
     case 'UPDATE':
      UpdateGATO(oDataOP, oRes);
     break;
     
     case 'DELETE':
      DeleteGATO(oDataOP, oRes);
     break;
     
     default:
      oRes.write(JSON.stringify({ 
        error: true, 
        error_message: 'Debes proveer una operación a realizar' 
      }));
      oRes.end();
     break;
     
   }   
 });
 
 oApp.listen(9016, function(oReq, oRes) {
   console.log("Servicios web gestión entidad GATO activo, en puerto 9016");   
 });