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
       // console.log("what") 
           
    }else{
        MODEL.changePage(pageID);
        //console.log(pageID)
    }
}
 
function initlisteners(){
    $(window).on("hashchange", route);
    $("div .filters__container__section__button").click(function(){
        console.log("what")
        $(this).addClass(" --selected");
       
    });
    
    route();
}


$(document).ready(function(){
    try{
        initFirebase();
    
        //route();
       initlisteners();
       // underlineActivePage();
      //  browseRecipes();

        
        let app = firebase.app();
    }catch{
        console.log("gwa");
    }
    
})