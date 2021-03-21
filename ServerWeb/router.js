const express = require("express");
var bodyParser = require("body-parser");
const router = express.Router();

var server= express();
server.use(bodyParser.urlencoded({ extended: true }));
server.listen(80);



module.exports = router;


const market = require('./market');
const mangopay = require('./mangopay');

var user;
var product;

router
.get("/", (req, res) => {
    //market.hello();
    res.render(__dirname + '/views/index.ejs');
})

.post("/login", async (req, res) => {

    //vérification connection
    if(await market.connection(req.body.email, req.body.mdp)){

        //Récupération des informations sur l'utilisateur que ce connecte
        user = await market.getUserConnected();

        //Récupérations de la liste des produits
        var products = await market.getAllProducts();

        res.render(__dirname + '/views/accueil.ejs', {
            products: products
        });
    }
    else{
        //Echec de connection
        res.render(__dirname + '/views/index.ejs');
    }    
})

.get("/home", async (req, res) => {
    var products = await market.getAllProducts();
    res.render(__dirname + '/views/accueil.ejs', {
        products: products
    });
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
    console.log("here");
    //Récupération du produit 
    var product = await market.getProductById(req.body.idProduct);
    //console.log(product)

    //Récupération du vendeur du produit
    var seller = await market.getUserById(product.seller);
    //console.log(seller);


    var delivery;

    //Récupération du frais de livraison [SOAP] 
    delivery = await market.getDelivery(product.weight); //<TODO>
    console.log("delivery await qui n'await pas");
    console.log(delivery);

    //TODO trouvé pour utiliser la valeur delivery récup du soap
    delivery = 10;


    res.render(__dirname + '/views/buy.ejs', {
        product: product,
        seller: seller,
        user: user,
        delivery: delivery
    });
})

.post("/buyBook", async (req, res) => {
    console.log(req.body);

   mangopay.marketSale(req.body.userMangopayId, req.body.sellerMangopayId,  req.body.price +req.body.delivery);

   var products = await market.getAllProducts();

   res.render(__dirname + '/views/accueil.ejs', {
       products: products
   });
})

//Erreur 404
.use((req, res) => {
    res.status(404);
    res.json({
        error: "Page not found !!"
    });
})

