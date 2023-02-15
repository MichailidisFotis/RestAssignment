$(function () {
   
  $(".readButton").on("click", function () {
        var id = "" + $(this).val();
        
        const xhr = new XMLHttpRequest();
        
        xhr.open("POST", "/news/read/" + `${id}`);
        xhr.send(null);
        xhr.responseType = "json";
        
        
        xhr.onload = function () {
          
          location.replace("/read.html");

        };
       
      });
    
  });