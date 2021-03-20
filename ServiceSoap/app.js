"use strict";

const soap = require('soap');
const express = require('express');
const fs = require('fs');

const port = 8000;

// load the WSDL file
const xml = fs.readFileSync('service.wsdl', 'utf8');

// create express app
const app = express();


//----------------------------------------------------------
//-----------         SOAP Service        ------------------
//----------------------------------------------------------
var serviceObject = {
    DeliveryCalulatorService: {
        DeliveryCalulatorServiceSoapPort: {
            DeliveryCalulator: deliveryCalculator
        },
        DeliveryCalulatorServiceSoap12Port: {
            DeliveryCalulator: deliveryCalculator
        }
    }
};

// root handler
app.get('/', function (req, res) {
    res.send('Node Soap Example!<br /><a href="https://github.com/macogala/node-soap-example#readme">Git README</a>'); //TODO a modifier
})
  
// Launch the server and listen on *port*
app.listen(port, function () {
    console.log('Listening on port ' + port);
    var wsdl_path = "/wsdl";
    // create SOAP server that listens on *path*
    soap.listen(app, wsdl_path, serviceObject, xml);
    console.log("Check http://localhost:" + port + wsdl_path +"?wsdl to see if the service is working");
});



//----------------------------------------------------------
//----------- Function of the web service ------------------
//----------------------------------------------------------

function deliveryCalculator(args){
    console.log("[SOAP] function call : deliveryCalculator");
    // ... 
    // code à améliorer TODO 
    // ...
    var distance = parseInt(args.distance, 10);
    var weight = parseInt(args.weight, 10);
    //return distance + 5;
    return weight*0.01
}