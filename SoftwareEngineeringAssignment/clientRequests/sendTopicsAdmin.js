const table = document.getElementById("newsTable");


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


const sendTopics = ()=>{

    sendRequest('GET' , '/users/token' , "")
    .then(response =>{
        token  =  response.accessToken;

        sendRequest('GET' , '/news/admin/getTopics' ,token)
        .then(response=>{
            for (var i = 0; i < response.length; i++) {
                var row = table.insertRow(i + 1);
                
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                
             
                cell1.innerHTML = `<input style="margin-left:25%;"  type=text value='${response[i].title}'readonly>`;
                cell2.innerHTML = `<input style="margin-left:25%;" type=text value='${response[i].date}'readonly>`
            
                
              }
        })
    })

}


sendTopics() ;
