

$( function () {
    $("#submitButton").on("click", function () {
      var firstname = $("#firstname").val();
      var surname = $("#surname").val();
      var username = $("#username").val();
      var password  =$("#password").val();
      var verifyPassword = $("#verifyPassword").val()
      
      
      var data = {
        firstname: firstname.trim(),
        surname: surname.trim(),
        username: username.trim(),
        password:password.trim(),
        verifyPassword:verifyPassword.trim()
      };

      const jsonString = JSON.stringify(data);
      const xhr = new XMLHttpRequest();
  
      xhr.open("POST", "/users/signup");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(jsonString);
      xhr.responseType = "json";
  
      xhr.onload = function () {
        let responseObj = xhr.response;
        alert(responseObj.message);
          location.replace("/register.html");
       
      };

    });
  });