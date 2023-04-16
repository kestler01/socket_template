const express = require('express')
const app = express()
const http = require('http')
const server = http.createServer(app)
// express basics above
//db connection in between
require('dotenv').config()
require('./config/database')
// socket goodness below
const { Server } = require('socket.io')
// create a new socket.io instance by passing the express server to the sockets Server constructor function,
const io = new Server(server)
// express router constants
const userRoutes = require('./app/routes/userRoutes')
// const user = require('./app/models/user')
const auth = require('./app/lib/auth')
const customErrorHandler = require('./app/lib/errorHandler')
// express home route
app.use(express.static('public'))
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })// serve up index.html as static file
app.use(auth) // do not know if i need this line here( if i manually implement sending the user as part of my responses for socket goodness already )

io.on('connection', (socket) => {
	console.log('a user connected with socket:', socket.id)

	let handshake = socket.handshake
	// if we haven't signed in yet / no token
	// if (!handshake.auth.token) {
	// 	console.log('inside check')
	// 	console.log(handshake.auth)
	// 	io.to(socket.id).emit('error', socket.id)
	// }

	// socket.broadcast.emit('chat message','a new user has joined the chat')
	socket.on('signup', (data) => {
		console.log(' a user signed up ')
        console.log(data)
		userRoutes['signup'](data, io, socket.id, customErrorHandler)
	})
	socket.on('signin', (data) => {
		console.log(' a user signed in ')
        console.log(data)
        userRoutes['signin'](data, io, socket.id, customErrorHandler)
	})
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
	console.log(" I'm listening on *:3000")
})
