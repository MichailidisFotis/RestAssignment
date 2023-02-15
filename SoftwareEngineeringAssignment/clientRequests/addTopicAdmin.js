$( function () {
    $("#titleButton").on("click", function () {
      var title  =  $("#titleBox").val();
      console.log(title)
      
      const sendRequest =(method , url , token , data)=>{
        const promise = new Promise((resolve , reject)=>{
            const xhr  = new XMLHttpRequest();
            xhr.open(method , url);
            
            xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.responseType='json';

            if(token!="")
                 xhr.setRequestHeader('Authorization' , 'Bearer '+token)
            
                 if(data!=null){
                    const jsonString = JSON.stringify(data)
                    xhr.send(jsonString)
                    }
                else
                    xhr.send(null)

            
    
            xhr.onload=function(){
                resolve(xhr.response);
            };
            
        })
        return promise;
    }
    
    var data ={
        title:title.trim()
    }
    var user_token;
    
    const addTopic=()=>{
         sendRequest('GET' ,'/users/token',"",null).then(responseData =>{
         
            user_token = responseData.accessToken
            
           
             sendRequest('POST' , '/news/createTopic', user_token , data).then(responseData=>{
                alert(responseData.message)
                location.replace("/createTopicAdmin.html")
             })  
        });
    }
    
    addTopic();

    });
    
  });