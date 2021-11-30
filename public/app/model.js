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

    
    return {
        changePage : _changePage,

    }
})();
