$( function () {
    $(".acceptButton").on("click", function () {
            var topic_id  =  $(this).val()

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
            
            var token  ; 


            const acceptTopic =  ()=>{
                sendRequest('GET' ,'/users/token' , "")
                .then(response =>{
                    token = response.accessToken
                    
                    sendRequest('PUT', '/news/admin/publishTopic/'+topic_id , token)
                    .then(response=>{
                        alert(response.message)
                        location.replace("/topicsAdmin.html")
                    })
                })
            }
            acceptTopic();
    });
  });