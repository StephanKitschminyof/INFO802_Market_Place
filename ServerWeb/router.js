const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();

var server= express();
server.use(bodyParser.urlencoded({ extended: true }));
server.listen(80);



module.exports = router;


const market = require('./market');

var user;

router
.get("/", (req, res) => {
    //market.hello();
    res.render(__dirname + '/views/index.ejs');
})

.post("/login", async (req, res) => {
    console.log("Login ...");
    //vérification si la connection est possible
    if(await market.connection(req.body.email, req.body.mdp)){
        //get des info sur l'user
        user = await market.getUserConnected();

        //get des produits pour les afficher
        var products = await market.getAllProducts();
        
        console.log("...Ok !");
        res.render(__dirname + '/views/accueil.ejs', {
            products: products
        });
    }
    else{
        console.log("...Fail !");
        res.render(__dirname + '/views/index.ejs');
    }    
})

.get("/sell", (req, res) => {
    res.render(__dirname + '/views/sell.ejs');
})

.post("/saveSell", async (req, res) => {
    var product = {
        name: req.body.name,
        title: req.body.title,
        author: req.body.author,
        price: req.body.price,
        weight: req.body.weight,
        pictureLink: req.body.pictureLink
    }
    await market.addProduct(product, user);

    var products = await market.getAllProducts();
    res.render(__dirname + '/views/accueil.ejs', {
        products: products
    });
})

.post("/buy", async (req, res) => {
    
    var product = await market.getProductById(req.body.idProduct);
    //console.log("Produit");
    console.log(product)

    var seller = await market.getUserById(product.seller);
    console.log(seller);

   /*res.render(__dirname + '/views/buy.ejs', {
        product: product,
        seller: seller,
        delivery: delivery
    }); */
    
})

//Erreur 404
.use((req, res) => {
    res.status(404);
    res.json({
        error: "Page not found !!"
    });
})

