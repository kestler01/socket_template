const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// express basics above
// socket goodness below
const { Server } = require('socket.io')
// create a new socket.io instance by passing the express server to the sockets Server constructor function, 
const io = new Server(server)

// express home route
app.use(express.static("public"))
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })// serve up index.html as static file

io.on('connection', (socket) => {
    console.log('a user connected with socket:', socket.id)
    socket.broadcast.emit('chat message','a new user has joined the chat')
    socket.on('disconnect', () => {
        console.log(' a user disconnected')
        io.emit('chat message', 'a use has left the chat')
    })
    socket.on('chat message', (msg) => {
        console.log('message: ' + msg)
        io.emit('chat message', msg)
    })
})

server.listen(3000, () => {
    console.log(' I\'m listening on *:3000')
})