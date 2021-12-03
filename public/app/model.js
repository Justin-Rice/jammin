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
        <a href = "#/description"><div class="recipe__image" onclick="loadRecipeDescription(${doc.data().recipeNum})"></div></a>
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
                 <div class="desc__top__image">
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
                 <div class="button">Edit</div>
                 <div class="button">Delete</div>
               </div>  `)                 
                 
                }else{
                 
                    $(".recipes").append(`
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

    
    return {
        changePage : _changePage,
        loadRecipesPage: _loadRecipesPage,
        loadDescription: _loadDescription

    }
})();
