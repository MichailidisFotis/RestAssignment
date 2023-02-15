$( function () {
    $("#newsEdit").on("click", function () {
      
      var news_id =  $("#newsEdit").val()
        
      const title  =  $("#title").val()
      const topics  = $("#topics").val()
      const content  = $("#newsContentText").val()
      
      var tempArray =  topics.split(',')
      var topicsList = []

      tempArray.forEach(element => {
        var topic =  element.replace(/\s/,'')
        topicsList.push(topic)
      });
      
      console.log(topicsList)

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

    var access_token ;
    
    var data = {
        title :title,
        content:content,
        topics:topicsList
    }

  
    const   SubmitEdit = ()=>{
        sendRequest('GET' , '/users/token' , "" , null)
        .then(resposeData  =>{
            var access_token  =resposeData.accessToken;
            
            sendRequest('PUT' , '/news/editNews/'+news_id , access_token , data)
            .then(resposeData=>{
                alert(resposeData.message)
                location.replace("/adminIndex.html")
            })
        })

    }
    SubmitEdit();

    });
    
  });