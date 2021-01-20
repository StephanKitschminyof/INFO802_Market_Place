const express = require("express");
const app = express();
const port = 8000;

const cors = require('cors');
const morgan = require('morgan');
const bodyParser = require('body-parser');

const router = require('./router');

app.use(morgan('combined'));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended:true
}));


app.use(router); //root are define in router.js


//Start server with $npm Start
app.listen(port, () => {
    console.log('Server app listening on port ' + port);
    console.log('Go http://localhost:'+port);
});