$( function () {
    $("#searchButton").on("click", function () {
        
        const table = document.getElementById("newsTable");
        var value = $("#searchBox").val()

        var words =value.split(" ")
        var wordsSearch = []
        
        
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



        
        for (var  i = 0 ; i<words.length ; i++){
            if(words[i]!='')
                wordsSearch.push(words[i])
            
        }

        if(words.length ===2){
            wordsSearch[2]=""
        }

        if(words.length===1){
            wordsSearch[1]=""
            wordsSearch[2]=""
        }

        if(words.length>3)
            {
                alert("Please search only with 3 words")
                window.location.reload(true)
            }
        else{
            var data = {
                words:wordsSearch
          };
    
        }

        var token;

        console.log(data)
        
        const SearchTopics = ()=>{
            sendRequest('GET' , '/users/token' , "" ,null)
            .then(responseData =>{
                    token  = responseData.accessToken

                    

                    sendRequest('POST' , '/news/journalist/searchTopic' , token , data)
                    .then(responseData =>{

                        for (var i = 0; i < responseData.length; i++) {
                            var row = table.insertRow(i + 1);
                            
                            var cell1 = row.insertCell(0);
                            var cell2 = row.insertCell(1);
                            
                           
                            cell1.innerHTML = `<input type=text value='${responseData[i].title}'readonly>`;
                            cell2.innerHTML = `<input type=text value='${responseData[i].date}'readonly>`
                           
                            
                          }
            
                 


                    })
            })
        }

        SearchTopics();

      
    });
  });