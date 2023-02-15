$( function () {
    $("#commentSubmit").on("click", function () {
      var firstname = $("#commentFirstname").val();
      var surname = $("#commentSurname").val();
    
      var content = $("#commentContent").val();
      var news_id = $("#commentSubmit").val();
      
      //*check if firstname or surname is empty
    if(firstname.trim() == "" )
        firstname =null
    else    
       firstname= firstname.trim()
    if(surname.trim() =="")
        surname=null
    else
        surname=surname.trim()
      
        //*create data to send to send
        var data = {
        news_id :  news_id,
        firstname: firstname,
        surname: surname,
        content: content.trim(),
        
      };

      const jsonString = JSON.stringify(data);
      const xhr = new XMLHttpRequest();
  
      xhr.open("POST", "/comments/addComment");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(jsonString);
      xhr.responseType = "json";
  
      xhr.onload = function () {
        let responseObj = xhr.response;
        alert(responseObj.message);
        
       
      };

    });
  });