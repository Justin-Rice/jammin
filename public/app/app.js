var loggedIn = false;
var _db;
var ingredNum = 2;
var instructNum = 2;

function initFirebase(){
  _db = firebase.firestore();
    firebase
    .auth()
    .onAuthStateChanged(function(user){
        if(user){
            loggedIn = true;
            $("#logOut").css("display","block");
            $("#logIn").css("display","none");
            $("#create").css("display","flex");

        

            console.log("user detected");
        }else{
          loggedIn = false;
            $("#logIn").css("display","block");
            $("#logOut").css("display","none");
            $("#create").css("display","none");



          
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
            MODEL.changePage('home');
          }).catch((error) => {
            // An error happened.
          });
          
        }
      })

}
signInWithProvider = (provider)=>{
  firebase
  .auth()
  .signInWithPopup(provider)
  .then((result) => {
      Toast.fire({
          icon: 'success',
          title: 'user signed in',
        })
   /** @type {firebase.auth.OAuthCredential} */
   var credential = result.credential;

   // This gives you a Google Access Token. You can use it to access the Google API.
   var token = credential.accessToken;
   // The signed-in user info.
   var user = result.user;
   console.log(user + "user google")
   
 }).catch((error) => {
   // Handle Errors here.
   var errorCode = error.code;
   var errorMessage = error.message;
   // The email of the user's account used.
   var email = error.email;
   // The firebase.auth.AuthCredential type that was used.
   var credential = error.credential;
   // ...
 });


}
signInGoogle = () =>{
  //console.log("Gwa")
  var provider = new firebase.auth.GoogleAuthProvider();
  signInWithProvider(provider);
}

function createRecipe(){
  //var x = document.getElementById("createImg");
  //var i = x.selectedIndex;
let ingred = [];
let ins = [];
  let imageFile = $("#createfile").prop("files")[0];
  if(imageFile !=null){

    let storageRef = firebase.storage().ref();
    let imageFile = $("#createfile").prop("files")[0];
    const metadata = {contentType: imageFile.type };
    let name = $("#recipe-name").val();
    let date = Date.parse(new Date());
    let type = $("#recipe-type").val();
    let skill = $("#recipe-skill").val();
    let time = $("#recipe-time").val();
    let desc = $("#recipe-desc").val();

    $(".addIng").map(function(){
      ingred.push($(this).val())
      // console.log($(this).val());
    })

    $(".addIns").map(function(){
      ins.push($(this).val())
     // console.log($(this).val());
  
    })
     
    console.log(ingred, ins);
    console.log("booyah");

    _db = firebase.firestore();
    const task = storageRef 
    .child("food/" + date + imageFile.name)
    .put(imageFile, metadata)
    task
    .then((snapshot)=>snapshot.ref.getDownloadURL())
    .then((url)=>{
      let userObj = {
          recipeDesc: desc,
          recipeIngred : ingred,
          recipeIns : ins,
          recipeImageURL: url,
          recipeNum: date,
          recipeName: name,
          recipeType: type,
          recipeSkill : skill,
          recipePrep : time,
      }
      console.log(url);
      _db
      .collection("Recipes")
      .doc()
      .set(userObj)
      .then(function(doc){
     

      })
  });
  


  
  }else{
    console.log("missing image");
  }

}

function filter(){
  $(".filters__container__section__button").click(function(e){
    $(".recipes").html('');
    var typeId = $(this).attr('id')
    var value = $(this).attr('value')
    //console.log(typeId)
    _db
    .collection("Recipes")
    .where(value, "==" , typeId)
    .get()
    .then(function(querySnapshot){
      querySnapshot.forEach(function(doc){

        loadNewRecipes(doc);
        
      })

  }, 
  function(error){
      console.log("error", error);
  });
    

  })

  $(".filters__container__section__button.reset").click(function(e){
    $(".recipes").html('');
      MODEL.loadRecipesPage();
  })



}

function loadNewRecipes(doc){
  $(".recipes").append(`
               <div class="recipe">
      <div class="recipe__head">${doc.data().recipeName}</div>

      <div class="recipe__info">
        <div class="recipe__image" onclick="loadRecipe(index)"></div>
        <div class="recipe__info__type">Type: ${doc.data().recipeType}</div>
        <div class="recipe__info__difficulty">Difficulty: ${doc.data().recipeSkill}</div>
        <div class="recipe__info__prep">Prep Time: ${doc.data().recipePrep}</div>
      </div>
    </div>`)

}

function loadRecipeDescription(index){
  MODEL.changePage("description");
 
  setTimeout(function(){MODEL.loadDescription(index)}, 200);

 
}

function reset(){
  location.reload();

}
function addIngred(e){
  $(".ingredients").append(`
  <input class="addIng" id="ind${ingredNum}" type="text" placeholder="Ingredient #${ingredNum}" />
  `)

  ingredNum ++;  

}

function addInstruct(e){
  $(".instructions").append(`
  <input class="addIns" id="ind${instructNum}" type="text" placeholder="Instruction #${instructNum}" />
  `)

  instructNum ++;  

}


function route(){
    let hashTag = window.location.hash;
    let pageID = hashTag.replace("#/","");
    //pageID holds page name

    if(!pageID){
        MODEL.changePage("home");   
       // console.log("what") 
           
    }else if(pageID == 'recipes'){
      MODEL.loadRecipesPage();
        MODEL.changePage("recipes", filter);
        

    }else{
        MODEL.changePage(pageID);
        //console.log(pageID)
    }
}
function recipeListeners(){
    // $(".filters__container__section__button").click(function(){
    //   var id = $(this).attr('id')
    //     if($(this).hasClass("--selected") ){
    //         $(this).removeClass("--selected");
    //         $(this).addClass("--not-selected");


    //         console.log("yes")

    //     }else{
    //     $(this).addClass("--selected");
    //     $(this).removeClass("--not-selected");
    //     }
       
    // });
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