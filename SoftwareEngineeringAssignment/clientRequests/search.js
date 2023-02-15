$( function () {
    $("#searchButton").on("click", function () {
        
        const table = document.getElementById("newsTable");
        var value = $("#searchBox").val()

        var words =value.split(" ")
        var wordsSearch = []
        
        
        
        for (var  i = 0 ; i<words.length ; i++){
            if(words[i]!='')
                wordsSearch.push(words[i])
            
        }

        if(words.length ===2){
            wordsSearch[2]=" "
        }

        if(words.length===1){
            wordsSearch[1]=" "
            wordsSearch[2]=" "
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
    
          const jsonString = JSON.stringify(data);
          const xhr = new XMLHttpRequest();
      
          xhr.open("POST", "/news/search");
          xhr.setRequestHeader("Content-Type", "application/json");
          xhr.send(jsonString);
          xhr.responseType = "json";
      
          xhr.onload = function () {
            let responseObj = xhr.response;


            for (var i = 0; i < responseObj.length; i++) {
                var row = table.insertRow(i + 1);
                // var cell0 = row.insertCell(0);
                var cell1 = row.insertCell(0);
                var cell2 = row.insertCell(1);
                var cell3 = row.insertCell(2);
               
                cell1.innerHTML = `<input type=text value='${responseObj[i].title}'readonly>`;
                cell2.innerHTML = `<input type=text value='${responseObj[i].date}'readonly>`
                cell3.innerHTML =`<button class="readButton"  type=button  value=${responseObj[i].id}>Read</button>`;
                
              }

              const element = document.createElement('script')
              element.setAttribute('src' , '/clientRequests/readNews.js')
              element.setAttribute('type' , 'text/javascript')
              document.body.append(element)

          };
    
        }
      
    });
  });