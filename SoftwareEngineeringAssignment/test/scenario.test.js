import request from 'supertest'
import makeApp from "../index.js"


const app = makeApp

const data={
    firstname:"testingFirstname",
    surname:"testingSurname",
    username:"testingUsername",
    password:"1234",
    verifyPassword:"1234"
}


const loginData ={
    username:"admin",
    password:"1234"
}

const topicData = {
    title:"testTopicTitle"    

};
const newsData ={   
    title:"test",
    content:"contentTextTest",
    topics :["testTopicTitle"]  
};

var user_id ;
var token;
var news_id;
var topic_id;
var comment_id;


test("Registration is done correctly",async()=>{
  var response =  await request(app).post("/users/signup")
  .send(data)

    expect(response.body.message).toBe("registration done")
    expect(response.status).toBe(201)
    user_id =  response.body.user_id
})

test("Login is done correctly" , async()=>{
    var response = await request(app).post("/users/login")
    .send(loginData)

    token =  response.body.accessToken
    expect(response.status).toBe(200)
})

test("creating topics is done correctly" , async()=>{
    var response = await request(app).post("/news/createTopic")
    .send(topicData)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("topic created")
    expect(response.status).toBe(201)

    topic_id =  response.body.topic_id;
})

test("accepting topic is done correctly" , async()=>{
    var response = await request(app).put("/news/admin/publishTopic/"+topic_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Topic published")
    expect(response.status).toBe(200)
})


test("creating news is done correctly", async()=>{
    var response = await request(app).post("/news/createNews")
    .send(newsData)
    .set('Authorization' ,'Bearer '+token)
    
    expect(response.body.message).toBe("news created")
    expect(response.status).toBe(201)
    news_id =''+response.body.news_id;
    
  })

test ("submiting news is done correctly" , async()=>{
    var response = await request(app).put("/news/submitCreated/"+news_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Submited successfully")
    expect(response.status).toBe(200)
})

test("accepting news is done correctly" , async()=>{
    var response = await request(app).put("/news/admin/acceptSubmited/"+news_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("News accepted")
    expect(response.status).toBe(200)
})

test("publishing news is done correctly" , async()=>{
    var response= await request(app).put("/news/admin/publishNews/"+news_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("News publish")
    expect(response.status).toBe(200)
})

 

test("creating comment is done correctly" , async()=>{
    var response = await request(app).post("/comments/admin/addComment")
    .send({
        news_id :""+news_id,
        content:"testCommentContent"
    })
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Your comment will be checked")
    expect(response.status).toBe(201)
    comment_id= response.body.comment_id
})

test("accepting comment is done correctly", async()=>{
    var response = await request(app).put("/comments/admin/acceptComment/"+comment_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Comment accepted")
    expect(response.status).toBe(200)
})

test("deleting comment is done correctly" , async()=>{
    var response = await request(app).delete("/comments/deleteComment/"+comment_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Comment deleted")
    expect(response.status).toBe(200)

})
test("deleting news is done correctly" , async()=>{
    var response = await request(app).delete("/news/deleteNews/"+news_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("news deleted")
    expect(response.status).toBe(200)
})

test("deleting topic is done correctly" , async()=>{
    var response = await request(app).delete("/news/testDeleteTopic/"+topic_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("Topic deleted")
    expect(response.status).toBe(200)
})




test("deleting user is done correctly" , async()=>{

    var response = await request(app).delete("/users/deleteUser/"+user_id)
    .send(null)
    .set('Authorization' , 'Bearer '+token)

    expect(response.body.message).toBe("user deleted")
    expect(response.status).toBe(200)
})

test("logout is done correctly" ,async()=>{
    var response = await request(app).post("/users/logout")
    .send(null)
    .set('Authorization' , 'Bearer '+token)
    token = ""

    expect(response.body.message).toBe("Logout successful")
  })