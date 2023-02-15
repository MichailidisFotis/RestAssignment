$( function () {
    $(".deleteButton").on("click", function () {
            var comment_id  =  $(this).val()

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
            
            var token; 


            const deleteComment=  ()=>{
                sendRequest('GET' ,'/users/token' , "")
                .then(response =>{
                    token = response.accessToken
                    
                    sendRequest('DELETE', '/comments/admin/rejectComment/'+comment_id , token)
                    .then(response=>{
                        alert(response.message)
                        location.replace("/adminIndex.html")
                    })
                })
            }
            deleteComment();
    });
  });