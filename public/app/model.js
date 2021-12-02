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

    var _loadRecipesPage = function(index){
        _db
        .collection("Recipes")
        .get()
        .then(function(querySnapshot){
            querySnapshot.forEach(function(doc){
               
               $(".recipes").append(`
               <div class="album">
                  <h1>${doc.data().title}</h1>
                  <div class="cover" style="background-image: url(${doc.data().cover});">
                </div>
                <div class="cont">
                  <p><span>Genre: </span>${doc.data().genre}</p>
                  <p><span>Artist: </span>${doc.data().artist}</p>
                </div>
    
    
    
               </div>
               `)
               //console.log(doc.data()) 
            })
    
        }, 
        function(error){
            console.log("error", error);
        });
    
       

    }

    
    return {
        changePage : _changePage,
        loadRecipesPage: _loadRecipesPage

    }
})();
