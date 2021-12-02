var loggedIn = false;

function initFirebase(){
    firebase
    .auth()
    .onAuthStateChanged(function(user){
        if(user){
            loggedIn = true;
            $("#logOut").css("display","block");
            $("#logIn").css("display","none");

        

            console.log("user detected");
        }else{
            $("#logIn").css("display","block");
            $("#logOut").css("display","none");


          
            console.log("user not there");
        }
    })

}
function logInUser(){
    let email = $("#email-li").val();
    let password = $("#pw-li").val();
    
   // console.log("login");
    firebase.auth().signInWithEmailAndPassword(email, password)
  .then((userCredential) => {
    $("#email-li").val("");
    $("#pw-li").val("");
    var user = userCredential.user;
    Swal.fire({
        icon: 'success',
        text: "You have successfully logged in.",
        background: "#ffd666" ,
        confirmButtonColor: '#A7E8BD'
      })
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    Swal.fire({
        background: "#ffd666",
        title: "Error",
        text: 'There has been an unexpected error in Login.',
        confirmButtonColor: '#F25C54'

      })
  });

}
function createUser(){
    let fName = $("#fName").val();
    let lName = $("#lName").val();
    let email = $("#email").val();
    let password = $("#pw").val();

    firebase
    .auth()
    .createUserWithEmailAndPassword(email, password)
    .then((userCredential) => {

    $("#fName").val("");
    $("#lName").val("");
    $("#email").val("");
    $("#pw").val("");
    var user = userCredential.user;
    Swal.fire({
        background: "#ffd666",
        title: "Account Created",
        text: 'you have been logged in.',
        confirmButtonColor: '#A7E8BD'

      })

    //console.log("account created")
    
  })
  .catch((error) => {
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorMessage);
    Swal.fire({
        background: "#ffd666",
        title: "Error",
        text: 'There has been an unexpected error in account creation',
        confirmButtonColor: '#F25C54'

      })
  });
}
function signOut(){

    Swal.fire({
        text: "Are you sure you want to log out?",
        icon: 'warning',
        background: "#ffd666" ,
        showCancelButton: true,
        confirmButtonColor: '#A7E8BD',
        cancelButtonColor: '#F25C54',
        confirmButtonText: 'Yes, logout',
        customClass: {
            container: 'popup-back',
            popup: 'popup',
            header: 'head',

        }

      }).then((result) => {
        if (result.isConfirmed) {
          Swal.fire({
            background: "#ffd666",
            text: 'You have been logged out.',
            confirmButtonColor: '#A7E8BD'

          })
          firebase.auth().signOut().then(() => {
            // Sign-out successful.
          }).catch((error) => {
            // An error happened.
          });
          
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
           
    }else if(pageID == 'recipes'){
        MODEL.changePage("recipes", recipeListeners);

    }else{
        MODEL.changePage(pageID);
        //console.log(pageID)
    }
}
function recipeListeners(){
    $(".filters__container__section__button").click(function(){
        if($(this).hasClass("--selected")){
            $(this).removeClass("--selected");
            $(this).addClass("--not-selected");


            console.log("yes")

        }else{
        $(this).addClass("--selected");
        $(this).removeClass("--not-selected");
        }
       
    });
}
function recipeReset(){

}
 
function initlisteners(){
    $(window).on("hashchange", route);
   
    
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