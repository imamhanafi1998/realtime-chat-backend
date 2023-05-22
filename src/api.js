const express = require('express')
const serverless = require("serverless-http");
require('../db/mongoose')
const cors = require('cors')
const app = express()
const port = 3000

const userRouter = require('../routers/user')
const postRouter = require('../routers/post')
const commentRouter = require('../routers/comment')
const reportRouter = require('../routers/report')
const userSavedPostRouter = require('../routers/userSavedPost')

app.use(express.json())
app.use(cors())

app.use(`/.netlify/functions/api`, userRouter)
app.use(`/.netlify/functions/api`, postRouter)
app.use(`/.netlify/functions/api`, commentRouter)
app.use(`/.netlify/functions/api`, reportRouter)
app.use(`/.netlify/functions/api`, userSavedPostRouter)

module.exports = app;
module.exports.handler = serverless(app);
