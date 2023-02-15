const header = document.getElementById("name");
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
var token;


const getNews = ()=>{

    sendRequest('GET' , '/users/token' , "")
    .then(response =>{
        token =  response.accessToken;
        sendRequest ('GET' ,'/news/admin/getNewsPublished' , token)
        .then(response=>{
            for (var i = 0; i < response.length; i++) {
                var row = table.insertRow(i + 1);
                // var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                // var cell5 = row.insertCell(4);
                cell1.innerHTML = `<input style="margin-left:25%;" type=text value='${response[i].title}'readonly>`;
                cell2.innerHTML = `<input style="margin-left:25%;" type=text value='${response[i].date}'readonly>`
                cell3.innerHTML =`<button style="margin-left:25%;" class="readButton" type=button  value=${response[i].id}>Read</button>`;
                
              }
            
              const element = document.createElement('script')
              element.setAttribute('src' , '/clientRequests/readNewsAdmin.js')
              element.setAttribute('type' , 'text/javascript')
              document.body.append(element)
        })
    })
}


getNews()

