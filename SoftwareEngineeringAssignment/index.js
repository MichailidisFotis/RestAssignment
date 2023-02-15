import express from "express"
import { fileURLToPath } from 'url';
import {dirname} from "path"
import usersRouter from "./users/users.js"
import newsRouter from "./news/news.js"
import commentsRouter from "./comments/comments.js"
const app =express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);




app.use(express.static(__dirname))

app.use('/users' ,usersRouter)
app.use('/news',newsRouter)
app.use('/comments',commentsRouter)





export default app

