const express = require('express')
const serverless = require("serverless-http");
require('../db/mongoose')
const cors = require('cors')
const app = express()
const router = express.Router()
const port = 3000

// http
const http = require('http').Server(app)

// socket.io
const io = require('socket.io')(http)

const Message = require('../models/message')

// const userRouter = require('../routers/user')
// const postRouter = require('../routers/post')
// const commentRouter = require('../routers/comment')
// const reportRouter = require('../routers/report')
// const userSavedPostRouter = require('../routers/userSavedPost')

// V1
// io.on('connection', (socket) => {
//     console.log(`⚡: ${socket.id} user just connected!`);
//     socket.on('disconnect', () => {
//       console.log('🔥: A user disconnected');
//     });
// });

// router.get('/messages', async (req, res) => {	
// 	Message.find({}, (err, messages) => {
//         res.send(messages);
//         console.log("sukses")
//     })
// })

// router.post('/messages', async (req, res) => {
//     const message = new Message(req.body);
//     await message.save((err) => {
//         if (err) {
//             console.log("gagal")
//             sendStatus(500);
//         }
//         io.emit('message', req.body)
//         res.sendStatus(200);
//     })
// })

app.use(express.json())
app.use(cors())

// V2
let users = []

io.on('connection', (socket) => {
    console.log(`⚡: ${socket.id} user just connected!`)  
    socket.on("message", data => {
      io.emit("messageResponse", data)
    })

    socket.on("typing", data => (
      socket.broadcast.emit("typingResponse", data)
    ))

    socket.on("newUser", data => {
      users.push(data)
      io.emit("newUserResponse", users)
    })
 
    socket.on('disconnect', () => {
      console.log('🔥: A user disconnected');
      users = users.filter(user => user.socketID !== socket.id)
      io.emit("newUserResponse", users)
      socket.disconnect()
    });
});

router.get("/api", (req, res) => {
  res.json({message: "Hello"})
});

app.use(`/.netlify/functions/api`, router)
// app.use(`/.netlify/functions/api`, postRouter)
// app.use(`/.netlify/functions/api`, commentRouter)
// app.use(`/.netlify/functions/api`, reportRouter)
// app.use(`/.netlify/functions/api`, userSavedPostRouter)

module.exports = app;
module.exports.handler = serverless(app);
