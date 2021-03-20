var { graphql, buildSchema } = require('graphql');// The root provides a resolver function for each API endpoint

var firebase = require("firebase");


/**
 *    FIREBASE configuration
 */
var firebaseConfig = {
    apiKey: "AIzaSyAGU2tVZc1WaWXfi5ZIxQjpkWncbO8XotA",
    authDomain: "kitschminyof-market.firebaseapp.com",
    databaseURL: "https://kitschminyof-market-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "kitschminyof-market",
    storageBucket: "kitschminyof-market.appspot.com",
    messagingSenderId: "939727854657",
    appId: "1:939727854657:web:96bd2cd44a0ea7f157bac0"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);


var resolver = {
  hello: () => {
    return 'Hello world!';
  },
  userByName: (arg) => {
    return findUserByName(arg);
  },
  users: () => {
      return findAllUsers();
  },
  userById: (arg) => {
    return findUserById(arg);
  },
  userByEmail: ({userEmail}) => {
      return findUserByEmail(userEmail);
  },
  products: () => {
    return findAllProducts();
  },
  productById: ({productId}) => {
    return findProductById(productId);
  }
  
};



/**
 *          FIREBASE 
 */


 // USER 

function findUserByName(args){
    return firebase.database().ref('/users').once('value').then((res) => {
        var user;
        res.forEach(function(item){
            if(item.val().name == args.userName){
                user = item.val();
            } 
        });
        return user;
    });
}

function findUserById(userId){
    return firebase.database().ref('/users').once('value').then((res) => {
        var user;
        
        res.forEach(function(item){
          if(item.val().id === userId.userId){
                user = item.val();
            } 
        });

        return user;
    });
}

function findUserByEmail(userEmail){
    return firebase.database().ref('/users').once('value').then((res) => {
        var user;
        res.forEach(function(item){
            if(item.val().email === userEmail){
                user = item.val();
            } 
        });
        return user;
    });
}

function findAllUsers(){
    return firebase.database().ref('/users').once('value').then((res) => {
      var users = [];
      res.forEach(function(item){
        users.push(item.val());    
      });
      return users;
    });
}

function addUserToFirebase(name, email, password){
    var id = firebase.database().ref('/users').push().key;

    var data = {
        id: id,
        name: name,
        email: email,
        password: password
    }

    var update = {};
    update['/users/'+id] = data;

    return firebase.database().ref().update(update);
}

// PRODUCT 

function findAllProducts(){
  return firebase.database().ref('/products').once('value').then((res) => {
    var products = [];
    res.forEach(function(item){
      products.push(item.val());    
    });
    return products;
  });
}

function findProductById(productId){
  return firebase.database().ref('/products').once('value').then((res) => {
    var product;
    res.forEach(function(item){
      if(item.val().id === productId){
        product = item.val();
      }
    });
    return product;
  });
}

function addProductToFirebase(product, seller){
    var id = firebase.database().ref('/products').push().key;
    
    var data = {
      id: id,
      name: product.name,
      title: product.title,
      author: product.author,
      price: product.price,
      weight: product.weight,
      pictureLink: product.pictureLink,
      seller: seller.id
  };

    var update = {};
    update['/products/'+id] = data;

    return firebase.database().ref().update(update);
}




module.exports = {
  resolver,
  addProductToFirebase,
  addUserToFirebase
}