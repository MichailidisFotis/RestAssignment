let titleBox  = document.getElementById("titleBox")
let topicsBox =  document.getElementById("topicsBox")
let contentBox = document.getElementById("newsBox")




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



    console.log(response)
     
    for (var i = 0 ;  i<response[0].topics.length ; i++){
        topicsList.push(response[0].topics[i].topic)
    }
    
    console.log(topicsList)

    titleBox.innerHTML =title;
    topicsBox.innerHTML = topicsList;
    contentBox.innerHTML = response[0].content

    



   


}