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


const sendComments = ()=>{

    sendRequest('GET' , '/users/token' , "")
    .then(response =>{
        token  =  response.accessToken;

        sendRequest('GET' , '/comments/admin/getCreatedComments' ,token)
        .then(response=>{
            for (var i = 0; i < response.length; i++) {
                var row = table.insertRow(i + 1);
                
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
                var cell4 = row.insertCell(3);
                var cell5 = row.insertCell(4);
                var cell6 = row.insertCell(5);

                cell1.innerHTML = `<input style="margin-left:23%;"  type=text value='${response[i].com_content}'readonly>`;
                cell2.innerHTML = `<input style="margin-left:23%;" type=text value='${response[i].firstname}'readonly>`
                cell3.innerHTML = `<input style="margin-left:23%;" type=text value='${response[i].surname}'readonly>`
                cell4.innerHTML = `<input style="margin-left:23%;" type=text value='${response[i].title}'readonly>`
                cell5.innerHTML = `<button style="margin-left:23%;" class="acceptButton" type=button  value=${response[i].comment_id}>Accept</button>`
                cell6.innerHTML = `<button style="margin-left:23%;" class="deleteButton" type=button  value=${response[i].comment_id}>Reject</button>`
            }


              const element = document.createElement('script')
              element.setAttribute('src' , '/clientRequests/acceptCommentsAdmin.js')
              element.setAttribute('type' , 'text/javascript')
              document.body.append(element)

              const element1 = document.createElement('script')
              element1.setAttribute('src' , '/clientRequests/rejectCommentsAdmin.js')
              element1.setAttribute('type' , 'text/javascript')
              document.body.append(element1)
        })
    })

}


sendComments() ;