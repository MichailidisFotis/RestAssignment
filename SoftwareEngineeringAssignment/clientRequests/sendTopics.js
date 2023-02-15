
const table = document.getElementById("newsTable");
let xhr = new XMLHttpRequest();

xhr.open("GET", "/news/getTopics");

xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();

xhr.responseType = "json";

xhr.onload = function () {
  let responseObj = xhr.response;
  
  for (var i = 0; i < responseObj.length; i++) {
    var row = table.insertRow(i + 1);
    // var cell0 = row.insertCell(0);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    
    // cell1.style.justifyContent = "center"
    // cell2.style.justifyContent = "center"

    // var cell5 = row.insertCell(4);
    cell1.innerHTML = `<input style="margin-left:25%;"  type=text value='${responseObj[i].title}'readonly>`;
    cell2.innerHTML = `<input style="margin-left:25%;" type=text value='${responseObj[i].date}'readonly>`

    
  }
};