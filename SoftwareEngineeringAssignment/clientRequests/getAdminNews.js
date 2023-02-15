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
var user_id;
var user_token;

const create=()=>{
     sendRequest('GET' ,'/users/token',"").then(responseData =>{
        user_id  =  responseData.user_id 
        user_token = responseData.accessToken
        
      
         sendRequest('GET' , '/news/admin/getNews', user_token).then(responseData=>{
            for (var i = 0; i < responseData.length; i++) {
                var row = table.insertRow(i + 1);
                // var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                
                cell1.innerHTML = `<input type=text value='${responseData[i].title}'readonly>`
                cell2.innerHTML = `<input type=text value='${responseData[i].date}'readonly>`
                cell3.innerHTML = `<input type=text value='${responseData[i].state}'readonly>`
                var cell6 = row.insertCell(5)
                if(responseData[i].state ==="created"){
                cell4.innerHTML =`<button class="editButton" type=button  value=${responseData[i].id}>Edit</button>`;
                cell5.innerHTML=  `<button class="createButton" type=button  value=${responseData[i].id}>Submit</button>`  
                cell6.innerHTML=  `<button class="deleteButton" type=button  value=${responseData[i].id}>Delete</button>`
                }
                else if(responseData[i].state==="published")
                cell4.innerHTML =`<button class="readButton" type=button  value=${responseData[i].id}>Read</button>`;
                
                else if(responseData[i].state==="submited"){
                cell4.innerHTML=`<button class="readOnlyButton" type=button  value=${responseData[i].id}>Read</button>`;
                cell5.innerHTML=`<button class="acceptButton" type=button  value=${responseData[i].id}>Accept</button>`;        
                cell6.innerHTML=`<button class="rejectButton" type=button  value=${responseData[i].id}>Reject</button>`;
                }
                else if(responseData[i].state==="accepted"){
                cell4.innerHTML=`<button class="readOnlyButton" type=button  value=${responseData[i].id}>Read</button>`;
                cell5.innerHTML=`<button class="publishButton" type=button  value=${responseData[i].id}>Publish</button>`; 
                }
              }
            
              const element = document.createElement('script')
              element.setAttribute('src' , '/clientRequests/readNewsAdmin.js')
              element.setAttribute('type' , 'text/javascript')
              document.body.append(element)

              const element2 = document.createElement('script')
              element2.setAttribute('src' , '/clientRequests/submitNewsAdmin.js')
              element2.setAttribute('type' , 'text/javascript')
              document.body.append(element2)

              const element3 = document.createElement('script')
              element3.setAttribute('src' , '/clientRequests/deleteCreatedNewsAdmin.js')
              element3.setAttribute('type' , 'text/javascript')
              document.body.append(element3)

              const element4 = document.createElement('script')
              element4.setAttribute('src' , '/clientRequests/readUnpublishedNewsAdmin.js')
              element4.setAttribute('type' , 'text/javascript')
              document.body.append(element4)

              const element5 = document.createElement('script')
              element5.setAttribute('src' , '/clientRequests/editNewsAdmin.js')
              element5.setAttribute('type' , 'text/javascript')
              document.body.append(element5)
              
              const element6 = document.createElement('script')
              element6.setAttribute('src' , '/clientRequests/rejectNewsAdmin.js')
              element6.setAttribute('type' , 'text/javascript')
              document.body.append(element6)


              const element7 = document.createElement('script')
              element7.setAttribute('src' , '/clientRequests/acceptNewsAdmin.js')
              element7.setAttribute('type' , 'text/javascript')
              document.body.append(element7)

              const element8 = document.createElement('script')
              element8.setAttribute('src' , '/clientRequests/publishNewsAdmin.js')
              element8.setAttribute('type' , 'text/javascript')
              document.body.append(element8)

    })  
    });
}

create()