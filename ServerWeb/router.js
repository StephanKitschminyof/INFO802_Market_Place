const express = require("express");
const router = express.Router();


module.exports = router;


router
.get("/", (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

.get("/accueil", (req, res) => {
    res.sendFile(__dirname + '/views/accueil.html');
})

.get("/hello", (req, res) => {
    res.json("Hello, cette page est un test pour le routage");
})

.get("/testSoap.ejs", (req, res) => {
    res.render('testSoap.ejs');
})

//Erreur 404
.use((req, res) => {
    res.status(404);
    res.json({
        error: "Page not found"
    });
})