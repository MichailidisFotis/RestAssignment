const titleInput  =  document.getElementById("title")
const topicsInput  = document.getElementById("topics")
const contentInput  = document.getElementById("newsContentText")
const editButton =  document.getElementById("newsEdit")

var topicsList = []



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

const NewsInfo = ()=>{
    
    sendRequest('GET' , '/users/token' , "" , null)
    .then(responseData =>{
        token =  responseData.accessToken

        sendRequest('GET' ,'/news/edit' , token , null)
        .then(responseData=>{

            let title  =  responseData[0].title
            let id = responseData[0].id
            let content = responseData[0].content
            let topicsList  =[]



            titleInput.value = title;
            contentInput.value = content;

            for (var i = 0 ;  i<responseData[0].topics.length ; i++){
                topicsList.push(responseData[0].topics[i].topic)
            }

            topicsInput.value = topicsList
            editButton.value = id

        })
    })

}

NewsInfo();

