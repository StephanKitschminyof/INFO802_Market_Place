'use strict';
var request = require('request');
const { Client } = require('@grpc/grpc-js');
var mangopay = require('mangopay2-nodejs-sdk'); //https://github.com/Mangopay/mangopay2-nodejs-sdk
const { getUserById } = require('./market');

//Api mangopay2-nodejs-sdk Init
var api = new mangopay({
    clientId: 'kyle',
    clientApiKey: 'LJM09hTAGJuQ1DrRRzf1ekQEQnPOVVZ9ok39GTy10SGVPHfTvK',
    // Set the right production API url. If testing, omit the property since it defaults to sandbox URL
    baseUrl: 'https://api.sandbox.mangopay.com'
});

/**
 * Get the user objet by him id
 * @param {String} idUser 
 * @return the user object https://docs.mangopay.com/endpoints/v2/users#e253_the-user-object
 */
async function getUser(userId){
    var user;

    await api.Users.get(userId, null ,null)
    .then(function(response){
        user = response;
    });

    return user;
}

/**
 * Get all wallets of a user
 * @param {String} userId
 * @return array of wallets object https://docs.mangopay.com/endpoints/v2/wallets#e20_the-wallet-object
 */
async function getWallets(userId){
    var wallet = [];
    
    await api.Users.getWallets(userId)
    .then(function(response) {
        wallet = response;
    });

    return wallet;
}

/**
 * Get all cards of an user
 * @param {String} userId
 * @returns array of card object https://docs.mangopay.com/endpoints/v2/cards#e181_the-card-object
 */
async function getCards(userId){
    var card = [];

    await api.Users.getCards(userId)
    .then(function(response) {
        card = response;
    });

    return card;
}

//TODO
async function payCardToWallet(user, user_wallet, user_card, debited_amount){
    var data = {
        "AuthorId": user.Id,
        "DebitedFunds": {
            "Currency": 'EUR',
            "Amount": debited_amount
        },
        "Fees": {
            "Currency": 'EUR',
            "Amount": 0
        },
            "CreditedWalletId": user_wallet,
            "SecureModeReturnURL": 'http://my_url_redirection_after_payment',
            "SecureMode": 'DEFAULT',
            "CardID": user_card.Id,
            "Tag": 'My market create a payin card direct',
            "StatementDescriptor": 'MGP payIN'
    };

    const params = {
        method: 'POST',
        body: data,
        json: true,
        url: 'https://api.sandbox.mangopay.com/v2.01/kyle/payins/card/direct',
        headers: { 
            'Content-Type': 'application/json',
            'Authorization': 'Bearer '+api.clientApiKey
        }
    };
    
    function callback(error, response, body){
        if(!error && response.statusCode == 200){
            console.log(body);
        }
        else{
            console.log("ERREUR PAYIN");
            console.log(response);
            console.log(body);
        }
    }

    request(params, callback);
}

/**
 * That realise a mangopay transfert between two wallet
 * @param {object} buyer 
 * @param {object} buyer_wallet 
 * @param {object} seller 
 * @param {object} seller_wallet 
 * @param {BigInteger} amount 
 * @returns 
 */
async function walletToWallet(buyer, buyer_wallet, seller, seller_wallet, amount){
    var myTransfert = new api.models.Transfer({
        AuthorId: buyer.Id,
        DebitedFunds: {
            Currency: "EUR",
            Amount: amount
        },
        Fees: {
            Currency: "EUR",
            Amount: amount*0.01
        },
        DebitedWalletId: buyer_wallet.Id,
        CreditedWalletId: seller_wallet.Id,
        Tag: "create by the node js server test"
    });

    api.Transfers.create(myTransfert)
    .then(function(){
        console.log("[MONGOPAY] transfert réalisé");
    })
    ;

    return true;
}

async function marketSale(idUser_Buyer, idUser_Seller, amount){
    //1 - Get buyer 
    var buyer = await getUser(idUser_Buyer);
    //console.log(buyer);

    //2 - Get buyer wallets
    var buyer_wallets = await getWallets(buyer.Id);
    //console.log(buyer_wallets);

    //3 - Get buyer card
    var buyer_cards = await getCards(buyer.Id);
    //console.log(buyer_cards[0])

//    //4 - Transfert Buyer card to Buyer wallet
    //payCardToWallet(buyer, buyer_wallets[0], buyer_cards[0], amount);

    //5 - Get Seller
    var seller = await getUser(idUser_Seller);

    //6 - Get Seller Wallet
    var seller_wallets = await getWallets(seller.Id);

    //7 - Buyer Wallet to Seller Wallet
    await walletToWallet(buyer, buyer_wallets[0], seller, seller_wallets[0], amount);
}



function main(){
    var idBuyer = 98397761;
    var idSeller = 98393361;

    marketSale(idBuyer, idSeller, 10);
}


module.exports = {
    marketSale
}