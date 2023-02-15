let xhr = new XMLHttpRequest();
xhr.open("GET", "/users/token");

xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();

xhr.responseType = "json";

xhr.onload = function () {
    let responseObj = xhr.response;
    if(responseObj.role!=1 || responseObj.role==null || responseObj.accessToken==null)
    {   alert("Unauthorized")
    location.replace("/index.html")              
    
}       



};