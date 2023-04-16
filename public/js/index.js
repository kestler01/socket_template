
// do not import socket io, we already have it and have to call teh script 
const socket = io({auth: {
    token:null}
})
// can specify url, but default is the host that servers the page, if I have 2 repos point this at the api

const messages = document.getElementById('messages')
// const form = document.getElementById('form')
// const input = document.getElementById('input')

const signupForm = document.getElementById('signupForm')
const signinForm = document.getElementById('signinForm')
console.log('load js')
console.log('signupForm:', signupForm)
console.log('signinForm:', signinForm)

// form.addEventListener('submit', function (e) {
// 	e.preventDefault()
//     console.log('clicked button, e is:', e)
// 	if (input.value) {
// 		socket.emit('chat message', input.value)
// 		input.value = ''
// 	}
// })

signupForm.addEventListener('submit', function (e) {
	e.preventDefault()
	// console.log('clicked sign up, e is:', e)
	let email=e.target[0].value
	let password=e.target[1].value
	let passwordConfirmation=e.target[2].value
	if (email && password && passwordConfirmation) {
		const payload = { email, password , passwordConfirmation}
		// socket.auth['email'] = email
		// socket.auth['password'] = password
		// socket.auth['passwordConfirmation']= passwordConfirmation
		// console.log(socket.auth)
		socket.emit('signup', payload)
		email = ''
		password = ''
		passwordConfirmation = ''
	}
})

socket.on('signupSuccess', (data) => {
	console.log('received sign-up socket emit, data is :', data)
	const item = document.createElement('li')
	item.textContent = data
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
})

signinForm.addEventListener('submit', function (e) {
	e.preventDefault()
	let email = e.target[0].value
	let password = e.target[1].value
	


	if (email && password) {
		const payload = { email, password }
		console.log(payload)
		// socket.data['email'] = email
		// socket['data']['password'] = password
		// console.log(socket.auth)
		socket.emit('signin', payload)
		email = ''
		password = ''
	}
})

socket.on('signinSuccess', (data) => {
	console.log('received sign-up socket emit, data is :', data)
	const item = document.createElement('li')
	item.textContent = data
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
})

// current expected data received here is the socket id


socket.on('chat message', (msg) => {
	const item = document.createElement('li')
	item.textContent = msg
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
})
socket.on('error', (error) => {
	console.log('Error!', error)
	console.log('error status: ', error.status)
})
