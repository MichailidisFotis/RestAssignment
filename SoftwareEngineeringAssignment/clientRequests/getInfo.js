
let xhr = new XMLHttpRequest();
xhr.open("GET", "/users/getLoggedIn");

xhr.setRequestHeader("Content-Type", "application/json");
xhr.send();

xhr.responseType = "json";

xhr.onload = function () {
    let responseObj = xhr.response;
    console.log(responseObj)
};