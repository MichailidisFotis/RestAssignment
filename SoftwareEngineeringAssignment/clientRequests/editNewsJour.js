$( function () {
    $(".editButton").on("click", function () {
      
      var news_id =  $(this).val()
        
      
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

    var token ;
    
    const choose = ()=>{
            sendRequest('GET' , '/users/token' , "" , null)
            .then(responseData =>{
                token =  responseData.accessToken

                sendRequest('POST' , '/news/edit/'+news_id , token , null)
                .then(responseData=>{
                    if(responseData==null)
                        location.replace("/journalistEditNews.html")
                    else    
                        alert(responseData.message)

                })
            })
    }

      choose();
    });
    
  });