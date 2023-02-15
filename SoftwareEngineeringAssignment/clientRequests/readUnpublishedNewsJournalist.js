$(function () {
    $(".readOnlyButton").on("click", function () {
          var news_id  =  $(this).val()
  
          const sendRequest =(method , url , token)=>{
              const promise = new Promise((resolve , reject)=>{
                  const xhr  = new XMLHttpRequest();
                  xhr.open(method , url);
                  
                  xhr.setRequestHeader('Content-Type', 'application/json');
                      xhr.responseType='json';
      
                  if(token!="")
                       xhr.setRequestHeader('Authorization' , 'Bearer '+token)
                  
                     
      
                  xhr.onload=function(){
                      resolve(xhr.response);
                  };
                  xhr.send()
              })
              return promise;
          }
  
          var token ; 
          const readOnly =  () =>{
              sendRequest('GET' , '/users/token' , "")
              .then(response=>{
                  token =  response.accessToken
  
                  sendRequest('POST' , '/news/journalist/readUnpublished/'+news_id,token)
                  .then(
                      location.replace("/readOnlyNewsJournalist.html")
                  )
  
              })
          }
  
              readOnly();
  
  
    });
  });
  