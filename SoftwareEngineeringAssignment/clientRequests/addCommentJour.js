
$( function () {
    $("#commentSubmit").on("click", function () {
        var content = $("#commentContent").val();
        var news_id = $("#commentSubmit").val();

        const sendRequest =(method , url , token , data)=>{
            const promise = new Promise((resolve , reject)=>{
                const xhr  = new XMLHttpRequest();
                xhr.open(method , url);
                
                if(token!="")
                     xhr.setRequestHeader('Authorization' , 'Bearer '+token)
                
                xhr.setRequestHeader('Content-Type', 'application/json');
                xhr.responseType='json';
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

        var user_token;

        var data={
            content:content.trim(),
            news_id:news_id
        }

        const addComment = ()=>{
            sendRequest('GET' , '/users/token' ,"" ,null)
            .then(responseData =>{
                user_token = responseData.accessToken

                sendRequest('POST' , '/comments/journalist/addComment' , user_token ,data)
                .then(responseData=>{
                    alert(responseData.message);
                    location.replace("/journalistReadNews.html");
                })
            })
        }
    addComment();
    });
  });