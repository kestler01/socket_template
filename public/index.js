//` do not import socket io, we already have it and have to call teh script 
//<script  src="/socket.io/socket.io.js"></script> 
//<script type="module" src="./index.js"></script>

const socket = io()
// can specify url, but default is the host that servers the page, if I have 2 repos point this at the api
const messages = document.getElementById('messages')
const form = document.getElementById('form')
const input = document.getElementById('input')


form.addEventListener('submit', function (e) {
	e.preventDefault()
    console.log('clicked button, e is:', e)
	if (input.value) {
		socket.emit('chat message', input.value)
		input.value = ''
	}
})



socket.on('chat message', function (msg) {
	var item = document.createElement('li')
	item.textContent = msg
	messages.appendChild(item)
	window.scrollTo(0, document.body.scrollHeight)
})
