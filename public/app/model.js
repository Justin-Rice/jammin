var MODEL = (function(){
    var _changePage = function(pageName, callback){
        $.get(`pages/${pageName}/${pageName}.html`, function(data){
            //console.log(data)
            $("#app").html(data);
            if(callback){
              callback();
    
            }
        });
        
    }

    var _loadRecipesPage = function(){
        _db
        .collection("Recipes")
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
         
               
               $(".recipes").append(`
               <div class="recipe" id ="${doc.data().recipeNum}">
      <div class="recipe__head">${doc.data().recipeName}</div>

      <div class="recipe__info">
        <a href ="#/recipes"><div class="recipe__image" style=
        "background-image:
        url(${doc.data().recipeImageURL});
        background-repeat: no-repeat;
        background-position: center;
        background-size: cover;
        object-fit: fill;" 
        onclick="loadRecipeDescription(${doc.data().recipeNum})"></div></a>
        <div class="recipe__info__type">Type: ${doc.data().recipeType}</div>
        <div class="recipe__info__difficulty">Difficulty: ${doc.data().recipeSkill}</div>
        <div class="recipe__info__prep">Prep Time: ${doc.data().recipePrep}</div>
      </div>
    </div>`)
            })
    
        }, 
        function(error){
            console.log("error", error);
        });
    
       

    }

    var _loadDescription = function(index){

        _db
        .collection("Recipes")
        .where("recipeNum" ,"==", index)
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
                //console.log(index)
                
                if(loggedIn){
                 console.log("yes")
                 $(".desc").append(`
                 <div class="desc__top">
                 <div class="desc__top__image" style=
                 "background-image:
                 url(${doc.data().recipeImageURL});
                 background-repeat: no-repeat;
                 background-position: center;
                 background-size: cover;
                 object-fit: fill;">
                   <div class="desc__top__image__title">${doc.data().recipeName}</div>
                 </div>
                 <div class="desc__top__info">
                   <div class="desc__top__info__detail">
                     Type: <span class="fill">${doc.data().recipeType}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Difficulty: <span class="fill">${doc.data().recipeSkill}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Prep Time: <span class="fill">${doc.data().recipePrep}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Description:
                     <p>
                     ${doc.data().recipeDesc}
                     </p>
                   </div>
                 </div>
               </div>
               <div class="desc__bottom">
                 <div class="desc__bottom__ingred">
                   <h1>Ingredients</h1>
                   <ul id="desc-ingred">
                   </ul>
                 </div>
                 <div class="desc__bottom__instruct">
                   <h1>Instructions</h1>
                   <ol id="desc-ins">
                    
                   </ol>
                 </div>
               </div>
               <div class="buttons">
                 <div id="edit" class="button">Edit</div>
                 <div id="delete" class="button">Delete</div>
               </div>  `)                 
              console.log( doc.id)

              var del = document.getElementById("delete");
              del.addEventListener("click", function() {
	            deleteRecipe(doc.id, doc.data().recipeNum, doc.data().recipeImageName );
              }, false);

              var edit = document.getElementById("edit");
              edit.addEventListener("click", function() {
	            loadEditRecipe(doc.id, doc.data().recipeNum, doc.data().recipeImageName );
              }, false);
                }else{
                 
                    $(".desc").append(`
                    
                 <div class="desc__top">
                 <div class="desc__top__image"  style=
                 "background-image:
                 url(${doc.data().recipeImageURL});
                 background-repeat: no-repeat;
                 background-position: center;
                 background-size: cover;
                 object-fit: fill;" >
                   <div class="desc__top__image__title">${doc.data().recipeName}</div>
                 </div>
                 <div class="desc__top__info">
                   <div class="desc__top__info__detail">
                     Type: <span class="fill">${doc.data().recipeType}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Difficulty: <span class="fill">${doc.data().recipeSkill}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Prep Time: <span class="fill">${doc.data().recipePrep}</span>
                   </div>
                   <div class="desc__top__info__detail">
                     Description:
                     <p>
                     ${doc.data().recipeDesc}
                     </p>
                   </div>
                 </div>
               </div>
               <div class="desc__bottom">
                 <div class="desc__bottom__ingred">
                   <h1>Ingredients</h1>
                   <ul id="desc-ingred">
                   </ul>
                 </div>
                 <div class="desc__bottom__instruct">
                   <h1>Instructions</h1>
                   <ol id="desc-ins">
                    
                   </ol>
                 </div>
               </div>
                 
                     `)                       

                 console.log("no")
                }
                let ingredLength = doc.data().recipeIngred.length
                let insLength = doc.data().recipeIns.length

                for(let count = 0; count < ingredLength; count++ ){
                    $("#desc-ingred").append(`
                    <li>${doc.data().recipeIngred[count]}</li>
                    `)  
                    //console.log(doc.data().recipeIngred[count]);
                }

                for(let count = 0; count < insLength; count++ ){
                    $("#desc-ins").append(`
                    <li>${doc.data().recipeIns[count]}</li>
                    `)  
                    //console.log(doc.data().recipeIngred[count]);
                }
                
              
            })
        }, 
        function(error){
            console.log("error", error);
        });

        
    }

    var _loadEdit = function(docID){
     var editData = _db.collection("Recipes").doc(docID);

     editData.get().then((doc) => {
      if (doc.exists) {
        
        $("#erecipe-name").val(doc.data().recipeName);
        $("#erecipe-type").val(doc.data().recipeType);
        $("#erecipe-skill").val(doc.data().recipeSkill);
        $("#erecipe-time").val(doc.data().recipePrep)
        $("#erecipe-desc").val(doc.data().recipeDesc);


        let ingredLength = doc.data().recipeIngred.length
        let ingredIndex =0;
        let insLength = doc.data().recipeIns.length
        let instIndex =0;
        
        console.log(instIndex)

        for(let count = 2; count < insLength+1; count++ ){
          $(".instructions").append(`
          <input class="addIns" id="ins${count}" type="text" placeholder="Instruction #${count}" />

          `)
        }
        for(let x = 1; x < insLength+1; x++ ){
        $("#ins"+x).val(doc.data().recipeIns[instIndex]);
        instIndex ++;

        }
        for(let count = 2; count < ingredLength+1; count++ ){
          $(".ingredients").append(`
          <input class="addIng" id="ind${count}" type="text" placeholder="Ingredient #${count}" />

          `)
        }
        for(let x = 1; x < ingredLength+1; x++ ){
        $("#ind"+x).val(doc.data().recipeIngred[ingredIndex]);
        ingredIndex ++;

        }

          console.log("Document data:", doc.data());
          
      $(".form").append(`<div id="edit" class="edit-recipe"> Edit Recipe</div>
      `); 
      
      var edit = document.getElementById("edit");
      edit.addEventListener("click", function() {
      submitEditRecipe(doc.id, doc.data().recipeNum, doc.data().recipeImageName );
      }, false);
      } else {
          // doc.data() will be undefined in this case
          console.log("No such document!");
      }
      }).catch((error) => {
      console.log("Error getting document:", error);
     });
    


       
     
  }

    var _loadCar = function(){
      //var editData = _db.collection("Recipes").where("recipeNum" ,"==", index);
    
      
      _db.collection("Recipes").limit(4).get().then(function(querySnapshot){
        querySnapshot.forEach(function(doc){
        //   <a href ="#/description"><div class="scroll" style=
        // "background-image:
        // url(${doc.data().recipeImageURL});
        // background-repeat: no-repeat;
        // background-position: center;
        // background-size: cover;
        // object-fit: fill;" 
        // onclick="loadRecipeDescription(${doc.data().recipeNum})"></div></a>

        // <img src=${doc.data().recipeImageURL}
        // onclick="loadRecipeDescription(${doc.data().recipeNum})"
        // ></img>

        var slide = 
        `   <img src=${doc.data().recipeImageURL}
        onclick="loadRecipeDescription(${doc.data().recipeNum})"
         ></img>
         `

        $(".your-class").slick("slickAdd", slide);
        //console.log(1)


      })
      }).then((querySnapshot)=>{

      })

    }
      

    
    return {
        loadCar : _loadCar,
        loadEdit : _loadEdit,
        changePage : _changePage,
        loadRecipesPage: _loadRecipesPage,
        loadDescription: _loadDescription

    }
})();
