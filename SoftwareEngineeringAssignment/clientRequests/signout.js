$( function () {
    $("#signoutButton").on("click", function () {
      
      const sendRequest =(method , url , token)=>{
        const promise = new Promise((resolve , reject)=>{
            const xhr  = new XMLHttpRequest();
            xhr.open(method , url);
            
            if(token!="")
                 xhr.setRequestHeader('Authorization' , 'Bearer '+token)
            
            xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.responseType='json';
    
            xhr.onload=function(){
                resolve(xhr.response);
            };
            xhr.send();
        })
        return promise;
    }
 
    var user_token;
    
    const logout=()=>{
         sendRequest('GET' ,'/users/token',"").then(responseData =>{
         
            user_token = responseData.accessToken
            
           
             sendRequest('POST' , '/users/logout', user_token).then(responseData=>{
                alert(responseData.message)
                location.replace("/index.html")
             })  
        });
    }
    
logout()
    });
    
  });


