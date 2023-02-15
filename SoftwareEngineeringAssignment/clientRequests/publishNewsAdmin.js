$(function (params) {
    $(".publishButton").on("click", function () {
        var news_id =  $(this).val()
        const sendRequest =(method , url , token)=>{
            const promise = new Promise((resolve , reject)=>{
                const xhr  = new XMLHttpRequest();
                xhr.open(method , url);
                
                xhr.setRequestHeader('Content-Type', 'application/json');
                    xhr.responseType='json';
    
                if(token!="")
                     xhr.setRequestHeader('Authorization' , 'Bearer '+token)
                
                   
                        
    
                
        
                xhr.onload=function(){
                    resolve(xhr.response);
                };
                xhr.send()
            })
            return promise;
        }

        const  publishNews = ()=>{
            sendRequest('GET' , '/users/token' , "")
            .then(responseData  =>{
                var access_token  =responseData.accessToken;
                
                sendRequest('PUT','/news/admin/publishNews/'+news_id,access_token)
                .then(responseData =>{
                    alert(responseData.message)
                    location.replace("/adminIndex.html")
                })

                
            })
    
        }
        publishNews();

    })
})