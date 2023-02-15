import express from "express";
import bodyParser from "body-parser";
import mysql from "mysql";
import md5 from "md5";
import jwt from "jsonwebtoken";


var jsonParser = bodyParser.json();

const accessTokenSecret="myaccesstoken";

const connection = mysql.createConnection({
  connectionLimit: 10,
  password: "",
  user: "root",
  database: "news_company",
  host: "localhost",
  port: 3306,
});

const router = express.Router();

 
var loggedInUser= false;
var user = []
var accessToken
//*create user
router.post("/signup", jsonParser, async (req, res) => {


  var user_id = Date.now();
  var firstname = req.body.firstname;
  var surname = req.body.surname;
  var username = req.body.username;
  var password = req.body.password;
  var verifyPassword = req.body.verifyPassword;


  if(user_id !=null && firstname !=null && surname!=null &&username!=null &&password!=null &&verifyPassword!=null
    && user_id !="" && firstname !="" && surname!="" &&username!="" &&password!="" &&verifyPassword!=""){

      if(password===verifyPassword){

        var users = await new Promise(async (resolve, reject) => {
          connection.query(
            "SELECT * FROM users WHERE username=?",
            [username],
            (err, result) => {
              
                resolve(result);
              
            }
          );
        });
        // console.log(users.length)
        if(users.length ==0){

          await new Promise(async (resolve, reject) => {
            connection.query(
              "INSERT INTO users(user_id,firstname , surname , username , user_password , role_id) VALUES(?,?,?,?,?,?)",
              [user_id,firstname, surname, username ,md5(password),2]
            );
            res.status(201);
            res.send({
              user_id:user_id,
              message: "registration done"
            });
          });

        }
        else{
          res.send({
            message:"Username already taken"
          })
        }

      }
      else{
        res.send({
          message: "passwords must match"
        })
      }


  }
  else{
    res.send({
      message:"All values must be inserted"
    })
  }

  

});


router.post("/login" ,jsonParser, async (req, res)=>{
  
  var password  =req.body.password
  var username = req.body.username;
  
  // globalThis.loggedInUser = false
  
   await new Promise(async (resolve ,  reject)=>{

    connection.query("SELECT * FROM users WHERE username = ? && user_password=?",
    [username , md5(password)],(err , result)=>{
        if(err){
          reject(err)
        
        }
        else{
          // resolve(result)
          if(result.length==1){
            user.splice(0,user.length)
            accessToken=jwt.sign({username:result[0].username , role:result[0].role_id } , accessTokenSecret);

            res.json({
              logged: true,
              role: result[0].role_id,
              user_id: result[0].user_id,
              accessToken:accessToken,
            }); 
            user.push({
              username:result[0].username,
              surname:result[0].surname,
              user_id:result[0].user_id,
              role_id:result[0].role_id,
              firstname:result[0].firstname
            })
          }
          else{
            res.send({
              message:"check your credentials"
            })
          }

        }
    })

  })


 



});


const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, accessTokenSecret, (err) => {
            if (err) { 
              return res.sendStatus(403);  
            }  
            next();
        });
    } else {
        res.sendStatus(401);
    }
};

router.get("/token" ,  (req , res)=>{

      if(user[0]!=null)
        res.json({
          user_id:user[0].user_id,    
          accessToken:accessToken,
          role:user[0].role_id});
      else{
        res.send({
          user_id:null,
          accessToken:null,
          role:null
        })
      }
})
  

router.get("/getLoggedIn" ,authenticateJWT , (req , res)=>{
    if (user[0]!=null) {
      
      res.json({      
       
        user_id:user[0].user_id
      })
    }
 
});


router.post('/logout',authenticateJWT, (req, res) => {
    accessToken=null;
    user[0]=null

    res.send({
      message:"Logout successful"});

});


router.get("/getLoggedIn2" ,authenticateJWT , (req , res)=>{
  if (user[0]!=null) {
    
    res.send({      
      message:"Ok",
      user_id:user[0].user_id
    })
  }
  else{
    res.send({
      message:"Not ok"
    })
  }
});


//*for testing only
router.delete("/deleteUser/:user_id" ,jsonParser , authenticateJWT ,async(req , res)=>{
          if(user[0]!=null){
            var user_id= req.params.user_id;
              new Promise((resolve, reject) => {
                connection.query("DELETE FROM users WHERE user_id =?" , user_id , (err , result)=>{
                  if(err)
                    reject(err)
                  else {
                    
                    resolve(result)}
                })
              })
              res.status(200)
              res.send({
                message:"user deleted"
              })
          }
          else{
            res.status(401)
            res.send({
              message:"Unauthorized"
            })
          }
} )

export  default router
export{ user , authenticateJWT};
