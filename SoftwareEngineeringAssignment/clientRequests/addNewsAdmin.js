
$( function () {
    $("#newsSubmit").on("click", function () {
      
      var title = $("#title").val();
      
      var topics = $("#topics").val();
      var content = $("#newsContentText").val();

      var tempArray =  topics.split(',')
      var topicsList = []

      tempArray.forEach(element => {
        var topic =  element.replace(/\s/,'')
        topicsList.push(topic)
      });

      console.log(title);
      console.log(topicsList)
      console.log(content.trim())

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

    var data1 = {
        title:title.trim(),
        content:content.trim(),
        topics:topicsList
    };
    
    const createNews=()=>{
        sendRequest('GET' , '/users/token',"",null).then(responseData=>{
            user_token = responseData.accessToken

            sendRequest('POST', '/news/createNews',user_token,data1).then(responseData=>{
                alert(responseData.message);
                location.replace("/createNewsAdmin.html")
            })
        })
    }

    createNews()

    });
    
  });
