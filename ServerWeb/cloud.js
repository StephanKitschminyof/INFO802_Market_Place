var firebase = require("firebase");


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


function test(){
    return firebase.database().ref('/user').once('value').then((res) => {
        res.forEach(function(item){
            console.log(item.val());
        });
    })
}



test();