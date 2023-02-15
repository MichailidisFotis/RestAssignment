
$( function () {
    $("#submitButton").on("click", function () {
      var username = $("#username").val()
      var password=$("#password").val()
      

      var data = {
            username:username.trim(),
            password:password.trim()
      };

      const jsonString = JSON.stringify(data);
      const xhr = new XMLHttpRequest();
  
      xhr.open("POST", "/users/login");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(jsonString);
      xhr.responseType = "json";
  
      xhr.onload = function () {
        let responseObj = xhr.response;
         
        if(!responseObj.logged){
            alert(responseObj.message)
            window.location.reload(true)
          }        
        
        if(responseObj.role ===1)
            location.replace("/adminIndex.html")
        if(responseObj.role===2)    
            location.replace("/journalistIndex.html")

       
      };

    });
  });