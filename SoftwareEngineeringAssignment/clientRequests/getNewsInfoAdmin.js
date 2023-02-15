let titleBox  = document.getElementById("titleBox")
let topicsBox =  document.getElementById("topicsBox")
let contentBox = document.getElementById("newsBox")
let commentBox = document.getElementById("comments")


let submitButton = document.getElementById("commentSubmit")



var xhr2 = new XMLHttpRequest();

xhr2.open("GET", "/news/read");

xhr2.setRequestHeader("Content-Type", "application/json");
xhr2.send();

xhr2.responseType = "json";

xhr2.onload=function(){
    let response = xhr2.response
    let title  =  response[0].title
    let id = response[0].id
    let topicsList  =[]
    let commentsList=[]

    submitButton.value=id
    console.log(response)
     
    for (var i = 0 ;  i<response[0].topics.length ; i++){
        topicsList.push(response[0].topics[i].topic)
    }
    
    console.log(topicsList)

    titleBox.innerHTML =title;
    topicsBox.innerHTML = topicsList;
    contentBox.innerHTML = response[0].content

    for(var i= 0 ; i<response[0].comments.length ; i++){
            commentsList.push(response[0].comments[i])        
    }
    
    if(commentsList.length ==0){
        var contentDiv = document.createElement("div")
        contentDiv.className = "commentContent"
        contentDiv.innerHTML = "No comments yet"
        commentBox.appendChild(contentDiv)
    }

    else{

        for (var i = 0 ; i<commentsList.length ; i++){
            let commentBox = document.getElementById("comments")
            var div = document.createElement("div")
            var contentDiv = document.createElement("div")
    
            
            
            div.className = "commentUser"
            if(commentsList[i].firstname  == null && commentsList[i].surname == null)
                div.innerHTML = 'Anonymous'
            else
                div.innerHTML = commentsList[i].firstname+" "+commentsList[i].surname
    
            contentDiv.className = "commentContent"
            contentDiv.innerHTML = commentsList[i].content
            
            commentBox.appendChild(div) 
            commentBox.appendChild(contentDiv)
               
        }

        

    }
   


}