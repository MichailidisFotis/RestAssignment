import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import { authenticateJWT, user } from "../users/users.js";
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

const date = new Date();

let day = date.getDate();
let month = date.getMonth() + 1;
let year = date.getFullYear();

let currentDate = `${year}-${month}-${day}`;

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

var newsData =[]



router.get("/getNews" , jsonParser ,async (req,res)=>{

    new Promise(async (resolve, reject) => {
        connection.query(
        "SELECT news.news_id as id , news.title as title , news.date_of_creation as date  "+
        "FROM news "+
        "WHERE news.news_state_id = 4 "+
        "order BY date"
        , (err, result) => {
         const news=[]
        
         if (err) reject(err);
         else {
           // resolve(result);
           for(var i = 0 ; i<result.length ; i++){
             news.push({
                id:result[i].id,
                title:result[i].title,
                date: formatDate(result[i].date),
                //topics:[result[i].topic_title]
                // topics:topics
             })
           }
           res.status(200);
           res.json(news);
         }
       });
     });
})

router.post("/edit/:news_id" , jsonParser , authenticateJWT , async(req ,res)=>{
 newsData = []

  
  if (user[0] != null) {
    var news_id = req.params.news_id;
    var user_id = user[0].user_id;
    var topics = [];

    var check = await new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM news WHERE news_id =? AND news_state_id = 1",
        [news_id],
        (err, result) => {
          if (err) reject(err);
          else resolve(result);
        }
      );
    });

    if (check.length != 0) {
      var check2 = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM news WHERE news_id =? AND user_id=? AND news_state_id = 1",
          [news_id, user_id],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });

      if (check2.length != 0) {
        new Promise(async (resolve, reject) => {
          connection.query(
            "SELECT topics.title as topic " +
              "from news_topics " +
              "join news on news.news_id = news_topics.news_id " +
              "join topics on topics.topic_id = news_topics.topic_id " +
              "where news.news_id =?",
            [news_id],
            (err, result) => {
              if (err) reject(err);
              else {
                for (var i = 0; i < result.length; i++) topics.push(result[i]);
              }
            }
          );
        });

        new Promise(async (resolve, reject) => {
          connection.query(
            "SELECT news_id ,title ,  content from news where news_id=?",
            [news_id],
            (err, result) => {
              if (err) reject(err);
              else {
                newsData.push({
                  id: result[0].news_id,
                  title: result[0].title,
                  content: result[0].content,
                  topics: topics
                });
                res.status(200);
                res.send(null);
              }
            }
          );
        });
      } else {
        res.status(403);
        res.send({
          message: "Unauthorized",
        });
      }
    } else {
      res.send({
        message: "news does't exist",
      });
    }

  } else {
    res.status(401);
    res.send({
      message: "Unauthorized",
    });
  }

  


})

router.get("/edit" , jsonParser , authenticateJWT  , async(req, res)=>{
  if(user[0]!=null)
    res.send(newsData)
  else{

    res.status(401)
    res.send({
      message:"Unauthorized"
    })}
})


router.put("/submitCreated/:news_id" , jsonParser , authenticateJWT ,async(req , res)=>{
    var news_id =  req.params.news_id
    var user_id  = user[0].user_id;

    if(user[0]!=null){
      var check = await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM news where news_id =? and news_state_id=1",[news_id],(err,result)=>{
            if (err) {
                reject(err)          
            }
            else
              resolve(result)
        })  
      })

      if(check.length!=0){
          var check2  = await new Promise((resolve, reject) => {
            connection.query("SELECT * from news where news_id=? and user_id=?",[news_id , user_id],(err,result)=>{
                if(err)
                  reject(err)
                else 
                resolve(result)
            })
          })
          //*check if all values are inserted before submition
          if(check2.length!=0){
              var takeTopics =  await  new Promise((resolve, reject) => {
                connection.query("SELECT * FROM news_topics "+
                "JOIN news on news.news_id = news_topics.news_id "+
                "JOIN topics on topics.topic_id = news_topics.topic_id "+
                "WHERE news.news_id = ?" ,[news_id] ,(err , result)=>{
                  if(err)
                    reject(err)
                  else 
                    resolve(result)
                } )
              })
              // console.log(check2[0].news_id)
              // console.log(takeTopics)
            if(check2[0].title !=null && check2[0].title!="" &&takeTopics.length!=0 &&
            check2[0].content !=null && check2[0].content!=""){

              var changeState = await new Promise((resolve, reject) => {
                connection.query("UPDATE news SET news_state_id=2 WHERE news_id=?" , news_id ,(err , result)=>{
                    if(err)
                    reject(err)
                    else
                    {
                      // res.status(200)
                      // res.send({
                      //   message:"Submited successfully"
                      // })
                      resolve(result)
                    }
                } )
              })

              res.status(200)
              res.send({
                        message:"Submited successfully"
                      })
            }
            else{
              res.send({
                message:"Cannot submit values are missing"
              })
            }
            
          }
          else {
            res.status(403);
            res.send({
              message:"Unauthorized"
            })
          }
      }
      else {
        res.send({
          message:"News don't exist"
        })
      }

   

    }
    else{
      res.status(401)
      res.send({
        message:"Unauthorized"
      })
    }

})

router.post("/journalist/searchTopic" , jsonParser,authenticateJWT, async(req , res)=>{
    var words  =  req.body.words;
    var wordsList = []
    var topics = []

    if(user[0]!=null){
      new Promise((resolve, reject) => {
          connection.query("SELECT * "+ 
          " from topics "+
          "WHERE (title like "+"'%"+""+words[0]+"%' "+" and title like "+"'%"+""+words[1]+"%' "+
          "and title like "+"'%"+""+words[2]+"%') and topic_state_id=2",(err , result)=>{
            if(err)
              reject(err)
            else
            { 
              for(var i = 0 ; i<result.length ; i++){
                topics.push({
                   id:result[i].topic_id,
                   title:result[i].title,
                   date: formatDate(result[i].date_of_creation)
                   
                })
              }
              res.status(200);
              res.json(topics);

              resolve(result)
            }
          })
        })
       
        


    }
    else{
      res.status(401)
      res.send({
        message:"Unauthorized"
      })
    }
    
})

router.post("/journalist/searchNews" , jsonParser, authenticateJWT , async(req , res)=>{
      var words  =  req.body.words;   
      var news = []

      if(user[0]!=null)
      { 
        new Promise((resolve, reject) => {
          connection.query("SELECT news.news_id as id, news.title as title , news.date_of_creation as date , news.content as content"+
          " FROM news "+
          "WHERE (title like "+"'%"+""+words[0]+"%' "+" and title like "+"'%"+""+words[1]+"%' "+
          "and title like "+"'%"+""+words[2]+"%') or "+" ( content like "+"'%"+""+words[0]+"%' "+
          "and content like "+"'%"+""+words[1]+"%' "+" and content like "+"'%"+""+words[2]+"%') and news.news_state_id=4 " ,(err , result)=>{
            if (err) reject(err);
            else {
              for(var i = 0 ; i<result.length ; i++){
                news.push({
                   id:result[i].id,
                   title:result[i].title,
                   content:result[i].content,
                   date: formatDate(result[i].date)
                   
                })
              }
              res.status(200);
              res.json(news);
              resolve(result)
            }
          } )
        })



        

      }
      else{
        res.status(401)
        res.send({
          message:"Unauthorized"
        })
      }


})




router.post("/read/:id" ,  jsonParser ,async(req , res)=>{
  newsData.splice(0,newsData.length)
  var id  =req.params.id

  var topics  =[] 
  var comments=[]
  new Promise(async (resolve, reject) => {
    connection.query(
    "SELECT topics.title as topic "+
    "from news_topics "+
    "join news on news.news_id = news_topics.news_id "+
    "join topics on topics.topic_id = news_topics.topic_id "+
    "where news.news_id =?" , [id]
    , (err, result) => {
    
    
     if (err) reject(err);
     else {
      for(var i  = 0 ; i <result.length ; i++)
        topics.push(result[i])
      }
   });
 });


 new Promise(async (resolve, reject) => {
  connection.query(
  "SELECT comments.content as content , comments.firstname  as firstname, comments.surname as surname "+
  "FROM comments "+
  "WHERE comments.news_id=? "
   , [id]
  , (err, result) => {
  
  
   if (err) reject(err);
   else {
    for(var i = 0 ;  i<result.length ; i++){
      comments.push({
        content:result[i].content,
        firstname:result[i].firstname,
        surname:result[i].surname
      })
    }
      
     
      
    }
 });
});

 new Promise(async (resolve, reject) => {
  connection.query(
  "SELECT news_id ,title ,  content from news where news_id=?"
   , [id]
  , (err, result) => {
  
  
   if (err) reject(err);
   else {
      newsData.push({
        id:result[0].news_id,
        title:result[0].title,
        content:result[0].content,
        topics:topics,
        comments:comments
      })
      res.status(200)
      res.send(null)
    }
 });
});
})

router.get("/read",jsonParser,async (req,res)=>{
  res.send(newsData)
});





router.post("/createNews" , jsonParser ,authenticateJWT, async (req, res)=>{
  
    if(user[0]!=null){
    
    var news_id = Date.now();
    var content = req.body.content;
    var user_id =  user[0].user_id;
    var title  =  req.body.title;
    var date_of_creation =  currentDate;
    var topics = req.body.topics
    var topics_ids=[]
    var topics_ids2=[]

    title =  title.trim()
    content =  content.trim()

    if (topics != null && title!=null &&content!=null&&
      topics != "" && title!="" &&content!="") {
        for(var i = 0 ;i<topics.length ; i++){
          topics_ids.push( await  new Promise( (resolve, reject) => {
            connection.query(
              "SELECT topic_id FROM topics WHERE title =? and topic_state_id=2 ",
              topics[i],
              (err, result) => {
                if (err) {
                  
                  reject(err)
                } else {  
                  
                  resolve(result[0])
                  
                }
              }
            );
          }))
    
        }

        // console.log(topics_ids)
        topics_ids.forEach(elements=>{
            if(elements !=undefined)
              topics_ids2.push(elements.topic_id)
        })
        

      if(topics_ids2.length ==topics.length){
          const checkTitle =  await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM news WHERE title =? " , title , (err , result)=>{
              if(err)
                reject(err)
              else 
                resolve(result)
            })
          })

          if(checkTitle.length==0){

            const insert =  await new Promise((resolve,reject)=>{
              connection.query(
                "INSERT INTO `news`(`news_id`, `user_id`, `title`, `content`, `date_of_creation`, `news_state_id`)"+ 
                "VALUES (?,?,?,?,?,?)",
                [news_id,user_id,title,content ,date_of_creation,1],
                (err, result) => {
                  if (err) {
                   
                    reject(err)
                  } else {
                    
                    
                    resolve(result);
                  }
                }
              );
            })
            var insert2
            for(var i = 0 ; i<topics_ids2.length ; i++){
              
             insert2 =  await new Promise((resolve,reject)=>{
              connection.query(
                "INSERT INTO `news_topics`(`news_id`, `topic_id`)"
                 +"VALUES (?,?)",
                [news_id,topics_ids2[i]],
                (err, result) => {
                  if (err) {
                    
                    reject(err)
                  } else {
                    
                    resolve(result)
                    
                  }
                }
              );
            })
            }
            res.status(201)
            res.send(
              {news_id :news_id,
              message:"news created"
              }
            )
            

          }
          else {
            res.send({
              message:"Title already exists"
            })
          }

            

      }
      else{
        res.send({
          message:"Topics not found"
        })
      }


    }
    else{
      res.send({
        message:"Some values are missing"
      })
    }
  
   }
   else{
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
   }
  

})




router.post("/createTopic" , jsonParser ,authenticateJWT ,async (req , res)=>{
    
  if(user[0] !=null){

    var title   = req.body.title;
    var topic_id  = Date.now();
    var user_id = user[0].user_id;
    var date_of_creation = currentDate;
    
    title =  title.trim();

    if(title!="" && title!=null){

      var check = await new Promise((resolve , reject)=>{
        connection.query("SELECT * from topics where title = ?" , title , (err , result) =>{
              if(err) 
                reject(err)
              else 
                resolve(result)
        } )
      }) 

      if (check.length == 0) {
        var insert = await new Promise((resolve, reject) => {
          connection.query(
            "INSERT INTO `topics`(`topic_id`, `title`, `date_of_creation`, `user_id`, `father_id`, `child_id`, `topic_state_id`)" +
              " VALUES (?,?,?,?,?,?,?)",
            [topic_id, title, date_of_creation, user_id, null, null, 1],(err,result)=>{
              if(err)
                reject(err)
              else{

                res.status(201)
                res.send({
                  topic_id:topic_id,
                  message:"topic created"})
                resolve(result)
              }
            }
            );
          });
          
          
      } else {
        res.send({
          message: "Topic already exists",
        });
      }

    }
    else{
      res.send({
        message:"title must be inserted"
      })
    }

  }
  else{
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }
})

router.get("/admin/getNews" , jsonParser , authenticateJWT , async(req , res)=>{
  var user_id =user[0].user_id

  if(user[0]!=null){

    if(user[0].role_id ==1){

      new Promise( async (resolve , reject)=>{
        connection.query("SELECT news.news_id as news_id, news.title as title ,"+ 
        "news.date_of_creation as date , news_states.description as state "+
        "FROM news "+
        "JOIN users on news.user_id = users.user_id "+
        "JOIN news_states on news.news_state_id = news_states.news_state_id "+ 
        "WHERE news.user_id= ? "+
        "ORDER BY news_states.news_state_id",[user_id],(err , result)=>{
          const news=[]
        
          if (err) reject(err);
          else {
            for(var i = 0 ; i<result.length ; i++){
              news.push({
                 id:result[i].news_id,
                 title:result[i].title,
                 date: formatDate(result[i].date),
                 state:result[i].state
                 
              })
            }
            res.json(news);
            res.status(200);
          }
        })
      })


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

    
})

router.get("/admin/getNewsPublished" , jsonParser, authenticateJWT ,async (req,res)=>{

  if(user[0]!=null){

    if(user[0].role_id ==1){

      new Promise( (resolve, reject) => {
        connection.query(
        "SELECT news.news_id as id , news.title as title , news.date_of_creation as date  "+
        "FROM news "+
        "WHERE news.news_state_id = 4 "+
        "order BY date"
        , (err, result) => {
         const news=[]
        
         if (err) reject(err);
         else {
           // resolve(result);
           for(var i = 0 ; i<result.length ; i++){
             news.push({
                id:result[i].id,
                title:result[i].title,
                date: formatDate(result[i].date),
                //topics:[result[i].topic_title]
                // topics:topics
             })
           }
           res.status(200);
           res.json(news);
         }
       });
     });

    }
    else{
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

router.get("/admin/getTopics" , jsonParser , authenticateJWT ,async(req , res)=>{

  if(user[0]!=null){

    if(user[0].role_id ==1  ){

      new Promise(async (resolve, reject) => {
        connection.query(
        "SELECT  topics.title as title , topics.date_of_creation as date "+
        "FROM topics "+
        "WHERE topics.topic_state_id=2 "+
        "order BY title"
        , (err, result) => {
         const topics=[]
        
         if (err) reject(err);
         else {
           // resolve(result);
           for(var i = 0 ; i<result.length ; i++){
             topics.push({
    
                title:result[i].title,
                date: formatDate(result[i].date)
                
             })
           }
           res.json(topics);
           res.status(200);
         }
       });
     });


    }
    else{
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

router.put("/admin/publishTopic/:topic_id" , jsonParser,authenticateJWT ,async(req , res)=>{
  var topic_id  = req.params.topic_id

  if(user[0]!=null)
  { 
    if(user[0].role_id==1){

      var checkExistance =  await new Promise((resolve, reject) => {
        connection.query("SELECT * FROM topics where topic_id =?" , topic_id , (err , result)=>{
          if(err)
            reject(err)
          else 
          resolve(result)
        })
      })

      if(checkExistance.length==1){

        var update = await new Promise((resolve, reject) => {
          connection.query(
            "UPDATE `topics`" + "SET `topic_state_id`=2 " + "WHERE topic_id =? ",
            topic_id,
            (err, result) => {
              if (err) reject(err);
              else {
                res.status(200)
                res.send({
                  
                  message:"Topic published"
                })
                resolve(result);
    
              }
            }
          );
        });

      }
      else {
        res.send({
          message:"Topic doesn't exist"
        })
      }




    }
    else{
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

router.delete("/admin/deleteCreatedTopic/:topic_id", jsonParser, authenticateJWT ,async (req, res) => {
    var topic_id = req.params.topic_id;
    if (user[0] != null) {
      if (user[0].role_id == 1) {

        var checkExistance = await new Promise((resolve, reject) => {
          connection.query("SELECT * FROM topics WHERE topic_id = ? and topic_state_id=1" , topic_id , (err , result)=>{
            if (err)
            reject(err)
            else 
            resolve(result)
          })
        })

        if(checkExistance.length==1){
          
          var deleteTopic  =  await new Promise((resolve, reject) => {
            connection.query("DELETE FROM topics where topic_id=?" , topic_id , (err , result)=>{
              if(err)
                reject(err)
              else 
              { 
                res.send({
                  message:"Topic deleted successfully"
                })
                resolve(result)
              }
            })
          })

        }
        else {
          res.send({
            message:"Topic doesn't exist"
          })
        }

      } else {
        res.status(403);
        res.send({
          message: "Unauthorized",
        });
      }
    } else {
      res.status(401);
      res.send({
        message: "Unauthorized",
      });
    }
  }
);

router.get("/admin/getSubmitedTopics" , jsonParser , authenticateJWT , async(req , res)=>{

  if(user[0]!=null){

    if(user[0].role_id==1){
      new Promise(async (resolve, reject) => {
        connection.query(
        "SELECT  topics.topic_id as topic_id , topics.title as title , topics.date_of_creation as date "+
        "FROM topics "+
        "WHERE topics.topic_state_id=1 "+
        "order BY title"
        , (err, result) => {
         const topics=[]
        
         if (err) reject(err);
         else {
           // resolve(result);
           for(var i = 0 ; i<result.length ; i++){
             topics.push({
                topic_id:result[i].topic_id,
                title:result[i].title,
                date: formatDate(result[i].date)
                
             })
           }
           res.json(topics);
           res.status(200);
         }
       });
     });
    }
    else{
      res.status(403)
      res.send({
        message:"Unauthorized"
      })
    }

  }
  else
  {
    res.status(401)
    res.send({
      message:"Unauthorized"
    })
  }
})

router.get("/admin/getAllUnpublishedNews" , jsonParser , authenticateJWT , async(req ,res)=>{

  var user_id =user[0].user_id

  if(user[0]!=null){

    if(user[0].role_id ==1){

      new Promise( async (resolve , reject)=>{
        connection.query(
         "SELECT news.news_id as news_id, news.title as title ,"+
        "news.date_of_creation as date , news_states.description as state "+
        "FROM news "+
        "JOIN users on news.user_id = users.user_id "+
        "JOIN news_states on news.news_state_id = news_states.news_state_id  "+
       	"WHERE NOT (news.news_state_id=4 OR  news.news_state_id=1)"+
        "ORDER BY news_states.news_state_id"
        ,(err , result)=>{
          const news=[]
        
          if (err) reject(err);
          else {
            for(var i = 0 ; i<result.length ; i++){
              news.push({
                 id:result[i].news_id,
                 title:result[i].title,
                 date: formatDate(result[i].date),
                 state:result[i].state
                 
              })
            }
            res.json(news);
            res.status(200);
          }
        })
      })


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

})

router.post("/admin/edit/:news_id" , jsonParser , authenticateJWT , async(req ,res)=>{
  newsData = []
 
   
   if (user[0] != null) {
     var news_id = req.params.news_id;
    
     var topics = [];

     if(user[0].role_id ==1){


      var check = await new Promise((resolve, reject) => {
        connection.query(
          "SELECT * FROM news WHERE news_id =? AND news_state_id = 1",
          [news_id],
          (err, result) => {
            if (err) reject(err);
            else resolve(result);
          }
        );
      });
  
      if (check.length != 0) {
 
  
       
          new Promise(async (resolve, reject) => {
            connection.query(
              "SELECT topics.title as topic " +
                "from news_topics " +
                "join news on news.news_id = news_topics.news_id " +
                "join topics on topics.topic_id = news_topics.topic_id " +
                "where news.news_id =?",
              [news_id],
              (err, result) => {
                if (err) reject(err);
                else {
                  for (var i = 0; i < result.length; i++) topics.push(result[i]);
                }
              }
            );
          });
  
          new Promise(async (resolve, reject) => {
            connection.query(
              "SELECT news_id ,title ,  content from news where news_id=?",
              [news_id],
              (err, result) => {
                if (err) reject(err);
                else {
                  newsData.push({
                    id: result[0].news_id,
                    title: result[0].title,
                    content: result[0].content,
                    topics: topics
                  });
                  res.status(200);
                  res.send(null);
                }
              }
            );
          });
       
      } else {
        res.send({
          message: "news don't exist",
        });
      }


     }
     else{
      res.status(403)
      res.send({
        message:"Unauthorized"
      })
     }
 
   } else {
     res.status(401);
     res.send({
       message: "Unauthorized",
     });
   }
 
  
})


router.delete("/admin/deleteCreatedNews/:news_id" , jsonParser , authenticateJWT , async(req , res)=>{
  if(user[0]!=null){
    if(user[0].role_id ==1){
      var news_id  =  req.params.news_id
      
      var check =  await new Promise((resolve, reject) => {
        connection.query("SELECT * from news where news_id=? and news_state_id=1" ,news_id,(err , result)=>{
          if(err)
          reject(err)
          else 
          resolve(result)
        } )
      })
      
      if(check.length!=0){
              console.log("mphke")

              var deleteNewsTopics =  await new Promise((resolve, reject) => {
                connection.query("DELETE FROM news_topics  WHERE news_id=?" , news_id ,(err,result)=>{
                  if(err)
                    reject(err)
                  else 
                    resolve(result)
                })
              })
              var deleteNews =  await new Promise((resolve, reject) => {
                connection.query("DELETE FROM news WHERE news_id =?" , news_id , (err , result)=>{
                  if(err)
                    reject
                  else{
                    res.status(200)
                    res.send({
                      message:"News deleted"
                    })
                    resolve(result)
                 }               
                  })
              })
            } 
            else{
              res.send({
                message:"News don't exist"
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
  else {
    res.status(401)
    res.send({
      message:"Unauthporized"
    })
  }
})

router.put("/admin/rejectSubmitedNews/:news_id" , jsonParser, authenticateJWT,async(req,res)=>{
   var news_id = req.params.news_id;
   if (user[0] != null) {
     if (user[0].role_id == 1) {
          var check  =  await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM news WHERE news_id=? and news_state_id=2" , news_id , (err , result)=>{
              if(err)
                reject(err)
              else 
                resolve(result)
            })
          })

          if(check.length!=0){
              var update =  await new Promise((resolve, reject) => {
                connection.query("UPDATE `news` SET `news_state_id`=1 WHERE news_id=?" , news_id , (err , result)=>{
                  if(err)
                    reject(err)
                  else
                    { res.status(200)
                      res.send({
                        message:"News rejected"

                      })
                      resolve(result)
                    }
                })
              })
          } 
          else{
            res.send({
              message:"News don't Exist"
            })
          }

     } else {
       res.status(403);
       res.send({
         message: "Unauthorized",
       });
     }
   } else {
     res.status(401);
     res.send({
       message: "Unauthorized",
     });
   }
})

router.post("/admin/readUnpublished/:news_id" , jsonParser , authenticateJWT , async(req , res)=>{
      
      if(user[0]!=null){
        newsData.splice(0,newsData.length)
        var id  =req.params.news_id
      
        var topics  =[] 
       
        new Promise(async (resolve, reject) => {
          connection.query(
          "SELECT topics.title as topic "+
          "from news_topics "+
          "join news on news.news_id = news_topics.news_id "+
          "join topics on topics.topic_id = news_topics.topic_id "+
          "where news.news_id =?" , [id]
          , (err, result) => {
          
          
           if (err) reject(err);
           else {
            for(var i  = 0 ; i <result.length ; i++)
              topics.push(result[i])
            }
         });
       });
      
      

      
       new Promise(async (resolve, reject) => {
        connection.query(
        "SELECT news_id ,title ,  content from news where news_id=?"
         , [id]
        , (err, result) => {
        
        
         if (err) reject(err);
         else {
            newsData.push({
              id:result[0].news_id,
              title:result[0].title,
              content:result[0].content,
              topics:topics
    
            })
            res.status(200)
            res.send(null)
          }
       });
      });

      }
      else{
        res.send({
          message:"Unauthorized"
        })
      }



})
router.put("/admin/acceptSubmited/:news_id" , jsonParser , authenticateJWT ,async(req , res)=>{

  var news_id = req.params.news_id;
  if (user[0] != null) {
    if (user[0].role_id == 1) {
         var check  =  await new Promise((resolve, reject) => {
           connection.query("SELECT * FROM news WHERE news_id=? and news_state_id=2" , news_id , (err , result)=>{
             if(err)
               reject(err)
             else 
               resolve(result)
           })
         })

         if(check.length!=0){
             var update =  await new Promise((resolve, reject) => {
               connection.query("UPDATE `news` SET `news_state_id`=3 WHERE news_id=?" , news_id , (err , result)=>{
                 if(err)
                   reject(err)
                 else
                   { res.status(200)
                     res.send({
                       message:"News accepted"

                     })
                     resolve(result)
                   }
               })
             })
         } 
         else{
           res.send({
             message:"News don't Exist"
           })
         }

    } else {
      res.status(403);
      res.send({
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401);
    res.send({
      message: "Unauthorized",
    });
  }


})

router.put("/admin/publishNews/:news_id" , jsonParser , authenticateJWT , async(req , res)=>{

  var news_id = req.params.news_id;
  if (user[0] != null) {
    if (user[0].role_id == 1) {
         var check  =  await new Promise((resolve, reject) => {
           connection.query("SELECT * FROM news WHERE news_id=? and news_state_id=3" , news_id , (err , result)=>{
             if(err)
               reject(err)
             else 
               resolve(result)
           })
         })

         if(check.length!=0){
             var update =  await new Promise((resolve, reject) => {
               connection.query("UPDATE `news` SET `news_state_id`=4 WHERE news_id=?" , news_id , (err , result)=>{
                 if(err)
                   reject(err)
                 else
                   { res.status(200)
                     res.send({
                       message:"News publish"

                     })
                     resolve(result)
                   }
               })
             })
         } 
         else{
           res.send({
             message:"News don't Exist"
           })
         }

    } else {
      res.status(403);
      res.send({
        message: "Unauthorized",
      });
    }
  } else {
    res.status(401);
    res.send({
      message: "Unauthorized",
    });
  }
})



router.get("/getTopics" ,jsonParser  , async(req , res)=>{

  new Promise(async (resolve, reject) => {
    connection.query(
    "SELECT  topics.title as title , topics.date_of_creation as date "+
    "FROM topics "+
    "WHERE topics.topic_state_id=2 "+
    "order BY title"
    , (err, result) => {
     const topics=[]
    
     if (err) reject(err);
     else {
       // resolve(result);
       for(var i = 0 ; i<result.length ; i++){
         topics.push({

            title:result[i].title,
            date: formatDate(result[i].date)
            
         })
       }
       res.json(topics);
       res.status(200);
     }
   });
 });

})


router.post("/search" , jsonParser , async(req ,  res)=>{

  var words  = req.body.words
  // var send = "";

  // for(var  i = 0  ;i<words.length ; i++){
  //   if(i===words.length-1)
  //     send+=words[i]
  //   else
  //     send +=words[i]+" and ";
  
  // }
  var news = []
  new Promise(async (resolve , reject)=>{
    connection.query(
      "SELECT news.news_id as id, news.title as title , news.date_of_creation as date , news.content as content"+
      " FROM news "+
      "WHERE (title like "+"'%"+""+words[0]+"%' "+" and title like "+"'%"+""+words[1]+"%' "+
      "and title like "+"'%"+""+words[2]+"%') or "+" ( content like "+"'%"+""+words[0]+"%' "+
      "and content like "+"'%"+""+words[1]+"%' "+" and content like "+"'%"+""+words[2]+"%') "
      , (err, result) => {
       
      
       if (err) reject(err);
       else {
         // resolve(result);
         for(var i = 0 ; i<result.length ; i++){
           news.push({
              id:result[i].id,
              title:result[i].title,
              content:result[i].content,
              date: formatDate(result[i].date)
              
           })
         }
         res.json(news);
         res.status(200);
       }
     });
  })
  

})


router.get("/getNews/:id" , authenticateJWT ,async (req,res)=>{

  new Promise(async (resolve, reject) => {
      connection.query(
      "SELECT news.news_id as id , news.title as title , news.date_of_creation as date  "+
      "FROM news "+
      "WHERE news.news_state_id = 4 "+
      "order BY date"
      , (err, result) => {
       const news=[]
      
       if (err) reject(err);
       else {
         // resolve(result);
         for(var i = 0 ; i<result.length ; i++){
           news.push({
              id:result[i].id,
              title:result[i].title,
              date: formatDate(result[i].date),
              //topics:[result[i].topic_title]
              // topics:topics
           })
         }
         res.json(news);
         res.status(200);
       }
     });
   });
})

router.get("/journalist/:user_id" , authenticateJWT , (req , res)=>{

  var user_id =req.params.user_id
    new Promise( async (resolve , reject)=>{
      connection.query("SELECT news.news_id as news_id, news.title as title ,"+ 
      "news.date_of_creation as date , news_states.description as state "+
      "FROM news "+
      "JOIN users on news.user_id = users.user_id "+
      "JOIN news_states on news.news_state_id = news_states.news_state_id "+ 
      "WHERE news.user_id= ? "+
      "ORDER BY news_states.news_state_id",[user_id],(err , result)=>{
        const news=[]
      
        if (err) reject(err);
        else {
          for(var i = 0 ; i<result.length ; i++){
            news.push({
               id:result[i].news_id,
               title:result[i].title,
               date: formatDate(result[i].date),
               state:result[i].state
               
            })
          }
          res.json(news);
          res.status(200);
        }
      })
    })
})

//*στον πίνακα news_in_progress
//*απο frontend θα σταλθουν δεδομένα με τον παρακατω τροπο
//*{ title:" ",
//*  content:" "
//*}
router.put("/editNews/:news_id" ,jsonParser, authenticateJWT ,async (req,res)=>{
      var news_id = req.params.news_id;
      var user_id =  user[0].user_id;

      var topics = req.body.topics
      var title  =  req.body.title
      var content = req.body.content
      var topics_ids=[]
      var topics_ids2 = []



      if(user[0]!=null){
            var checkExistance =  await new Promise((resolve, reject) => {
              connection.query("SELECT * FROM news where news_id=? and user_id=?" , [news_id , user_id],
              (err , result)=>{
                if(err)
                  reject(err)
                else 
                  resolve(result)
              })
            })


            if(checkExistance.length!=0){
                 var checkNewTitle  =  await new Promise((resolve, reject) => {
                  connection.query("SELECT * FROM news where title=? and NOT news_id=? " ,[ title, news_id] , (err , result)=>{
                    if(err)
                      reject(err)
                    else 
                      resolve(result)
                  })
                 })
                if(checkNewTitle.length==0){

                  if(topics.length!=0){
                    for(var i = 0 ;i<topics.length ; i++){
                      topics_ids.push( await  new Promise( (resolve, reject) => {
                        connection.query(
                          "SELECT topic_id FROM topics WHERE title =? and topic_state_id=2 ", 
                          topics[i],
                          (err, result) => {
                            if (err) {
                              
                              reject(err)
                            } else {  
                              
                              resolve(result[0])
                              
                            }
                          }
                        );
                      }))
                
                    }
            
                    // console.log(topics_ids)
                    topics_ids.forEach(elements=>{
                        if(elements !=undefined)
                          topics_ids2.push(elements.topic_id)
                    })
                    
                    if(topics_ids2.length==topics.length){
                      var deleteNewsTopics =  await new Promise((resolve, reject) => {
                        connection.query("DELETE from news_topics where news_id=?", news_id , (err , result)=>{
                          if(err)
                            reject(err)
                          else 
                          resolve(result)
                        })
                      })
                      for(var i = 0 ; i<topics_ids2.length ; i++){
              
                       var insert2 =  await new Promise((resolve,reject)=>{
                         connection.query(
                           "INSERT INTO `news_topics`(`news_id`, `topic_id`)"
                            +"VALUES (?,?)",
                           [news_id,topics_ids2[i]],
                           (err, result) => {
                             if (err) {
                               
                               reject(err)
                             } else {
                               
                               resolve(result)
                               
                             }
                           }
                         );
                       })
                       }

                       var update = await new Promise((resolve, reject) => {
                        connection.query("UPDATE news SET title=? , content=? WHERE news_id=?",[title,content,news_id] ,(err , result)=>{
                            if(err)
                              reject(err)
                            else{
                              res.send({
                                message:"news updated"
                              })
                              resolve(result)}
                        })
                      })

                    }
                    

                   


                  }
                  else{
                    res.send({
                      message:"Topics are missing"
                    })
                  }
             
                  
          

                }
                else{
                  res.send({
                    message:"Title exists"
                  })
                }


            }
            else{
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

//*στον πινακα news_in_progress 
router.delete("/journalist/deleteSaved/:news_id" , jsonParser , authenticateJWT ,async(req, res)=>{

  if(user[0]!=null){
    if(user[0].role_id ==2){
          var news_id  =  req.params.news_id  
          var user_id =  user[0].user_id
          var check =  await new Promise((resolve, reject) => {
            connection.query("SELECT * from news where news_id=? and news_state_id=1 and user_id=?" ,[news_id, user_id],(err , result)=>{
              if(err)
                reject(err)
              else 
                resolve(result)
            } )
          })
          
          if(check.length!=0){

            var deleteNewsTopics =  await new Promise((resolve, reject) => {
              connection.query("DELETE FROM news_topics  WHERE news_id=?" , news_id ,(err,result)=>{
                if(err)
                  reject(err)
                else 
                  resolve(result)
              })
            })
            var deleteNews =  await new Promise((resolve, reject) => {
              connection.query("DELETE FROM news WHERE news_id =?" , news_id , (err , result)=>{
                if(err)
                  reject
                else{
                  res.status(200)
                  res.send({
                    message:"News deleted"
                  })
                  resolve(result)
               }               
                })
            })
          } 
          else{
            res.send({
              message:"News don't exist"
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
else {
  res.status(401)
  res.send({
    message:"Unauthporized"
  })
}

})


router.get("/getTopicsById/:topic_id", jsonParser ,authenticateJWT ,async(req , res)=>{
      if(user[0]!=null){
          var topic_id  = req.params.topic_id

          var getTopic =  await new Promise((resolve, reject) => {
            connection.query("SELECT * FROM topics WHERE topic_id=?" , topic_id ,(err , result)=>{
              if(err)
                reject(err)
              else{
                resolve(result)
              }
            })
          })
          res.send(getTopic)
      }
      else {
        res.status(401)
        res.send({
          message:"Unauthorized"
        })
      }
  
})

router.get("/admin/getNewsBetweenDates" , jsonParser , authenticateJWT , async(req , res)=>{
  var date_1 =  req.body.date_1;
  var date_2 = req.body.date_2;
  var user_id =  user[0].user_id
  if(user[0]!=null){

    if(user[0].role_id==1){

      var getNews =  await new Promise((resolve, reject) => {
        connection.query("SELECT * "+
        "FROM `news` " +
        "join ( "+
          "  SELECT news_id from news where (news_state_id=1 AND user_id=?) OR news_state_id>1 "+
        ") A  on news.news_id =  A.news_id "+
       " WHERE date_of_creation >=? and date_of_creation<=? "
      ,[user_id,date_1, date_2],(err , result)=>{
          if(err)
            reject(err)
          else  
            resolve(result)
        })
      })
        res.send(getNews)
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


  
})

router.get("/admin/getTopicsDescendingOrder" , jsonParser , authenticateJWT , async(req , res)=>{
  if(user[0]!=null){  

          if(user[0].role_id==1){
                  var getTopics  =  await new Promise((resolve, reject) => {
                    connection.query("SELECT * FROM topics ORDER by topics_state_id DESC" , (err , result)=>{
                      if(err)
                        reject(err)
                      else 
                        resolve(result)
                    })
                  })

                  res.send(getTopics)
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


router.post("/journalist/readUnpublished/:news_id" , jsonParser , authenticateJWT,async(req , res)=>{
  var user_id = user[0].user_id;

  if(user[0]!=null){
    newsData.splice(0,newsData.length)
    var id  =req.params.news_id
    
    if(user[0].role_id==2){

      var topics  =[] 
   
      new Promise(async (resolve, reject) => {
        connection.query(
        "SELECT topics.title as topic "+
        "from news_topics "+
        "join news on news.news_id = news_topics.news_id "+
        "join topics on topics.topic_id = news_topics.topic_id "+
        "where news.news_id =?" , [id]
        , (err, result) => {
        
        
         if (err) reject(err);
         else {
          for(var i  = 0 ; i <result.length ; i++)
            topics.push(result[i])
          }
       });
     });
    
    
  
    
     new Promise(async (resolve, reject) => {
      connection.query(
      "SELECT news_id ,title ,  content from news where news_id=? and user_id=?"
       , [id , user_id]
      , (err, result) => {
      
      
       if (err) reject(err);
       else {
          newsData.push({
            id:result[0].news_id,
            title:result[0].title,
            content:result[0].content,
            topics:topics
  
          })
          res.status(200)
          res.send(null)
        }
     });
    });

    }
    else{
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

})

//*for testing only
router.delete("/deleteNews/:news_id" , jsonParser,authenticateJWT , async(req , res)=>{
  var news_id  =  req.params.news_id;
 
    if(user[0]!=null){

      var deleteNews_Topic =  await new Promise((resolve, reject) => {
        connection.query("DELETE FROM news_topics where  news_id=?" , news_id , (err,result)=>{
          if(err)
            reject(err)
          else 
            resolve(result)
        })
      })
      var deleteNews =  await new Promise((resolve, reject) => {
        connection.query("DELETE from news where news_id=?" , news_id , (err , result)=>{
          if(err)
            reject(err)
          else {
            res.status(200)
            res.send({
              message:"news deleted"
            })
            resolve(result) 
            }        
    })
      })

    }
    else{
      res.status(401)
      res.send({
        message:"Unauthorized"
      })
    }
   
     

})

router.delete("/testDeleteTopic/:topic_id" , jsonParser ,authenticateJWT , async(req , res)=>{
    var topic_id = req.params.topic_id;
    if (user[0] != null) {
      new Promise((resolve, reject) => {
        connection.query(
          "DELETE from topics where topic_id=?",
          topic_id,
          (err, result) => {
            if (err) reject(err);
            else {
              res.status(200);
              res.send({
                message: "Topic deleted"
              });
              resolve(result);
            }
          }
        );
      });
    } else {
      res.status(401);
      res.send({
        message: "Unauthorized",
      });
    }
})

export default router;