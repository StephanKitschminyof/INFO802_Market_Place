const compte =  
    [
        {
            "id": 1,
            "pseudo": "Stephan",
            "email": "kitschminyof.stephan12@gmail.com",
            "mdp": "stephan"
        },
        {
            "id": 2,
            "pseudo": "Jean",
            "email": "jeam@gmail.com",
            "mdp": "jean"
        }
    ];

function connection(email, mdp){
    //check si existe dans compte.json
    for(var i = 0; i < compte.length; i++){
        var obj = compte[i];

        console.log(obj["email"] + " && " + obj["mdp"]);

        if(obj["email"] == email && obj["mdp"] == mdp){
            return true; //TODO renvoyer l'user ?
        }
    }
    return false;
}