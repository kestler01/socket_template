const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10

const {
	BadParamsError,
	DocumentNotFoundError,
	BadCredentialsError,
} = require('../lib/custom_errors')
const User = require('../models/user')

const routerObj = {}

routerObj['signup'] = async (data, io, socketId, next) => {
	console.log('in signup route before user creation', data)
	try {
		if ( // check redundant with FE JS but i don't see that as a bad thing 
			!data ||
			!data.password || !data.username || 
			data.password !== data.passwordConfirmation
		) {
			throw new BadParamsError()
		}
		const hashPassword = await bcrypt.hash(data.password, bcryptSaltRounds)
		let {email, username} = data
		
		let userData = { email, username ,hashPassword }
		// userData.email = data.email,
		// userData.hashedPassword = hash
		let user = await User.create(userData)
		// send the new user object back with status 201, but `hashedPassword`
		// won't be send because of the `transform` in the User model
		console.log(user)
		console.log(user.toObject())
		user = await user.toObject()
		io.to(socketId).emit('signupSuccess', user) // add sign in functionality
	} catch (error) {
		next(error, io, socketId) // promisedError, io, socketId
	}
}

routerObj['signin'] = async (data, io, socketId, next) => {
	console.log('in userRouter for signin, the data passed is :', data)
	const pw = data.password
	try {
		const user = await User.findOne({ email: data.email }).populate('friends')
		if (!user) {
			throw new BadCredentialsError()
		}
		console.log(user)
		const passwordCorrect = await bcrypt.compare(pw, user.hashPassword)
		if (!passwordCorrect) {
			throw new BadCredentialsError()
		}
		// const token = crypto.randomBytes(16).toString('hex')
		// user.token = token
		user.socket = socketId
		await user.save()
		io.to(socketId).emit('signinSuccess', user.toObject())
	} catch (error) {
		next(error, io, socketId)
	}
}

routerObj['changePassword'] = async (data, io, socketId, next) => {
	console.log(
		'in change password route, the data passed is',
		data,
		'from socket id:',
		socketId
	)
	const pw = data.password
	const newPw = data.newPassword
	try {
		const user = await User.findOne({ socketId: socketId }).populate('friends')
		if (!user) {
			throw new DocumentNotFoundError()
		}
		const passwordCorrect = await bcrypt.compare(pw, user.hashPassword)
		if (!passwordCorrect) {
			throw new BadCredentialsError()
		}
		const hashPassword = await bcrypt.hash(newPw, bcryptSaltRounds)

		user.hashPassword = hashPassword
		await user.save()
		io.to(socketId).emit('changePasswordSuccess')
	} catch (error) {
		next(error, io, socketId)
	}
}

routerObj['signout'] = async (data, io, socketId, next) => {
	console.log('in signout route')
	try {
		const user = await User.findOne({ socketId: socketId })
		if (user) {
			user.socket = null
			await user.save()
		}
		io.to(socketId).emit('signoutSuccess')
	} catch (error) {
		next(error, io, socketId)
	}
}

module.exports = routerObj
