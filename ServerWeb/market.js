var { graphql } = require('graphql');
const graphQlSchema = require('./graphql/schema');
const {resolver, addProductToFirebase, addUserToFirebase} = require('./graphql/resolver');
const { response } = require('express');


var firebase;



var userConnected = null;

module.exports = {

    hello(){
        graphql(graphQlSchema, '{ hello }', resolver).then((response) => {
            console.log(response);
        });
    },

    async getUserConnected(){
        return userConnected;
    },

    async getUserById(userId){
        var user;
        var query = '{ userById( userId: \"'+userId+'\") {id, name, email} }';
        
        await graphql(graphQlSchema, query, resolver).then((response) => {
            user = response.data.userById;
        });
        return user; 
    },

    async connection(email, mdp){
        var user;
        var query = '{ userByEmail(userEmail: \"'+email+'\"){ id, name, email, password }}';

        await graphql(graphQlSchema, query, resolver).then((response) => {
            user = response.data.userByEmail;
        });

        if(user != null && user.password === mdp){
            userConnected = user;
            return true;
        }
        else{
            return false;
        }
       
    },

    async getAllProducts(){
        var products;
        var query = '{ products { id, name, title, author, price, weight, pictureLink, seller}}';

        await graphql(graphQlSchema, query, resolver).then((response) => {
            products = response.data.products;
        })

        return products;
    },

    async getProductById(productId){
        var product;
        var query = '{ productById( productId: \"'+productId+'\") {id, name, title, author, price, weight, pictureLink, seller}}';

        await graphql(graphQlSchema, query, resolver).then((response) => {
            product = response.data.productById;
        })

        return product;
    },

    async addProduct(product, seller){
        await addProductToFirebase(product, seller);
    }
};

