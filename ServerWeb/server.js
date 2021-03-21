const express = require("express");
const app = express();
const port = 8080;

const cors = require('cors');
const morgan = require('morgan');
const path = require('path');

const bodyParser = require('body-parser');
const { graphqlHTTP } = require('express-graphql');
var { graphql, buildSchema } = require('graphql');
const router = require('./router');

const graphQlSchema = require('./graphql/schema');
const graphQlResolvers = require('./graphql/resolver');


// -----------------------------------------------------------------
//              Ajout et configuration d'un middleware
// -----------------------------------------------------------------
//app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));

// -----------------------------------------------------------------
//              Ajout et configuration de graphql
// -----------------------------------------------------------------
app.use(
    '/graphql',
    graphqlHTTP({
      schema: graphQlSchema,
      rootValue: graphQlResolvers,
      graphiql: true
    })
  );
  
//To send css, img, ...
app.use(express.static(__dirname));

//Set the view engine to ejs
app.set('view engine', 'ejs');

//Set the router
app.use(router);

//Start the server
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
    console.log('Go http://localhost:'+port);
});
