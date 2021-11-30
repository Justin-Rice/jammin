var loggedIn = false;

function initFirebase(){
    firebase
    .auth()
    .onAuthStateChanged(function(user){
        if(user){

            loggedIn = true;
        

            console.log("user detected");
        }else{
          
            console.log("user not there");
        }
    })

}
function route(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/","");
    //pageID holds page name

    if(!pageID){
        MODEL.changePage("home");    
           
    }else{
        MODEL.changePage(pageID);
    }
}


$(document).ready(function(){
    try{
        initFirebase();
        route();
       // initlistener();
       // underlineActivePage();
      //  browseRecipes();

        
        let app = firebase.app();
    }catch{
        console.log("gwa");
    }
    
})