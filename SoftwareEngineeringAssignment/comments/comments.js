import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { user , authenticateJWT } from "../users/users.js";
import e from "express";


function padTo2Digits(num) {
  return num.toString().padStart(2, '0');
}

function formatDate(date) {
  return [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join('-')
}
var jsonParser = bodyParser.json();

const connection = mysql.createConnection({
  connectionLimit: 10,
  password: "",
  user: "root",
  database: "news_company",
  host: "localhost",
  port: 3306,
});

const router = express.Router();

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${year}-${month}-${day}`;



router.post("/journalist/addComment" , jsonParser , authenticateJWT ,async(req , res)=>{
      var comment_id  =Date.now();
      var firstname  = user[0].firstname;
      var surname =  user[0].surname;
      var news_id =  req.body.news_id;
      var date_of_creation =currentDate;
      var content =  req.body.content
      var user_id =  user[0].user_id;
      if(user[0]!=null && user[0].role_id===2){
        
         //*check if news with news_id exists
  var check =  await new Promise((resolve , reject)=>{
    connection.query("SELECT * FROM news WHERE news_id =? " , news_id , (err , result)=>{
        if(err)
          reject(err)
        else 
          resolve(result)
    })
  })

        if(check.length !=0){
      
          var add  = await new Promise((resolve , reject)=>{
            connection.query("INSERT INTO `comments`(`comment_id`, `content`, `user_id`, `firstname`, `surname`, `comment_state_id`, `date_of_creation`, `news_id`)"+
            " VALUES (?,?,?,?,?,?,?,?)" , [comment_id , content , user_id , firstname , surname ,1 , date_of_creation ,news_id] ,(err ,result)=>{
              if(err)
                reject(err)
              else{
                res.status(201)
                res.send({
                  comment_id:comment_id,
                  message:"Your comment will be checked"
                })
                resolve(result)
              }
            })
          })
      
        }
        else{
          res.send({
            message:"Problem, news don't exist"
          })
        }


      }
      else {
        res.status(401)
        res.send({
          message:"Unauthorized"
        })
      }

})

router.post("/admin/addComment" , jsonParser , authenticateJWT ,async(req , res)=>{
  var comment_id  =Date.now();
  var firstname  = user[0].firstname;
  var surname =  user[0].surname;
  var news_id =  req.body.news_id;
  var date_of_creation =currentDate;
  var content =  req.body.content
  var user_id =  user[0].user_id;
  if(user[0]!=null && user[0].role_id===1 ){
  
  //*check if news with news_id exists
  news_id.trim()
  var check =  await new Promise((resolve , reject)=>{
    connection.query("SELECT * FROM news WHERE news_id=?",news_id, (err , result)=>{
        if(err)
          reject(err)
        else 
          resolve(result)
    })
  })

  if(check.length !=0){
      
    var add  = await new Promise((resolve , reject)=>{
      connection.query("INSERT INTO `comments`(`comment_id`, `content`, `user_id`, `firstname`, `surname`, `comment_state_id`, `date_of_creation`, `news_id`)"+
      " VALUES (?,?,?,?,?,?,?,?)" , [comment_id , content , user_id , firstname , surname ,1 , date_of_creation ,news_id] ,(err ,result)=>{
        if(err)
          reject(err)
        else{
          res.status(201)
          res.send({
            comment_id:comment_id,
            message:"Your comment will be checked"
          })
          resolve(result)
        }
      })
    })

  }
  else{
    res.send({
      message:"Problem, news don't exist"
    })
  }

  
  }
  else {
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }
})



router.post("/addComment" , jsonParser ,async (req , res)=>{
    
    var comment_id = Date.now();
    var firstname = req.body.firstname;
    var surname = req.body.surname;
    var news_id = req.body.news_id;
    // var user_id = req.body.user_id;
    
    var date_of_creation = currentDate;
    var content = req.body.content

      //*check if news with news_id exists
  var check =  await new Promise((resolve , reject)=>{
    connection.query("SELECT * FROM news WHERE news_id =? " , news_id , (err , result)=>{
        if(err)
          reject(err)
        else 
          resolve(result)
    })
  })

  if(check.length !=0){
      
    var add  = await new Promise((resolve , reject)=>{
      connection.query("INSERT INTO `comments`(`comment_id`, `content`, `user_id`, `firstname`, `surname`, `comment_state_id`, `date_of_creation`, `news_id`)"+
      " VALUES (?,?,?,?,?,?,?,?)" , [comment_id , content , null , firstname , surname ,1 , date_of_creation ,news_id] ,(err ,result)=>{
        if(err)
          reject(err)
        else{
          res.status(201)
          res.send({
            comment_id:comment_id,
            message:"Your comment will be checked"
          })
          resolve(result)
        }
      })
    })

  }
  else{
    res.send({
      message:"Problem, news don't exist"
    })
  }

})

router.get("/admin/getCreatedComments" , jsonParser , authenticateJWT ,async(req , res)=>{
      
  if(user[0]!=null){

    if(user[0].role_id==1){

        var getComments =  await new Promise((resolve, reject) => {
          connection.query("SELECT comments.comment_id as comment_id  , comments.content  as com_content , comments.firstname as firstname, comments.surname as surname, news.title as title "+  
          "FROM comments "+
          "JOIN news on comments.news_id = news.news_id "+
          "WHERE comments.comment_state_id=1" , (err,result)=>{
            if(err)
              reject(err)
            else  
              resolve(result)
          })
        })

        res.send(getComments)
    }
    else {
      res.status(403)
      res.send({
        message:"Unauthorized"
      })
    }

  } 
  else {
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }

})

router.put("/admin/acceptComment/:comment_id" ,jsonParser ,authenticateJWT , async(req , res)=>{
  if(user[0]!=null){

    var comment_id = req.params.comment_id;
    
    if(user[0].role_id==1){
      var check  = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM comments where comment_id=? and comment_state_id=1" , comment_id ,(err , result)=>{
          if(err)
            reject(err)
          else 
            resolve(result)
        })
      })

      if(check.length!=0){
          var update =  await new Promise((resolve, reject) => {
            connection.query("UPDATE comments SET `comment_state_id`=2 WHERE comment_id=?" , comment_id , (err , result)=>{
              if(err)
                reject(err)
              else {
                res.send({
                  message:"Comment accepted"
    
                })
                resolve(result)
              }
            })
          })
      }
      else{
        res.send({
          message:"Comment doesnt exist"
        })
      }


    }
    else {
      res.status(403)
      res.send({
        message:"Unauthorized"
      })
    }

  }
  else{
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }
} )


router.delete("/admin/rejectComment/:comment_id" ,jsonParser ,authenticateJWT , async(req , res)=>{
  if(user[0]!=null){

    var comment_id = req.params.comment_id;
    
    if(user[0].role_id==1){
      var check  = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM comments where comment_id=? and comment_state_id=1" , comment_id ,(err , result)=>{
          if(err)
            reject(err)
          else 
            resolve(result)
        })
      })

      if(check.length!=0){
          var deleteComment =  await new Promise((resolve, reject) => {
            connection.query("DELETE FROM `comments` WHERE comment_id=?" , comment_id , (err , result)=>{
              if(err)
                reject(err)
              else {
                res.send({
                  message:"Comment deleted"
    
                })
                resolve(result)
              }
            })
          })
      }
      else{
        res.send({
          message:"Comment doesnt exist"
        })
      }


    }
    else {
      res.status(403)
      res.send({
        message:"Unauthorized"
      })
    }

  }
  else{
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }
} )

//*delete comments for testing only
router.delete("/deleteComment/:comment_id" , jsonParser , authenticateJWT , async(req,res)=>{
      if(user[0]!=null){    
        var comment_id  = req.params.comment_id;

        var deleteComment  = await new Promise((resolve, reject) => {
          connection.query("DELETE from comments where comment_id =?" , comment_id , (err , result)=>{
            if(err)
              reject(err)
            else {
              res.send({
                message:"Comment deleted"
              })
              resolve(result)
            }
          })
        })


      }
      else {
        res.status(401)
        res.send({
          message:"Unauthorized"
        })
      }
})  


  export default router;