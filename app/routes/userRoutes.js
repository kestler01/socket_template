const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10

const { BadParamsError } = require('../lib/custom_errors')
const User = require('../models/user')
const user = require('../models/user')

const routerObj = {}

routerObj['signup'] = async (data, io, socketId, next) => {
	console.log('in signup route before user creation', data)
	try {
		if (
			!data ||
			!data.password ||
			data.password !== data.passwordConfirmation
		) {
			throw new BadParamsError()
		}
		const hashPassword = await bcrypt.hash(data.password, bcryptSaltRounds)
		let email = data.email
		let userData = { email, hashPassword }
		// userData.email = data.email,
		// userData.hashedPassword = hash
		let user = await User.create(userData)
		// send the new user object back with status 201, but `hashedPassword`
		// won't be send because of the `transform` in the User model
		console.log(user)
		console.log(user.toObject())
		user = await user.toObject()
		io.emit('signupSuccess', user)
	} catch (error) {
		next(error, io, socketId) // promisedError, io, socketId
	}
}
routerObj['signin'] = async (req, io, socketId, next) => {
	console.log('in userRouter for signin, the data passed is :', req)
	const pw = req.password
	let user
	// find a user based on the email that was passed
	User.findOne({ email: req.email })
		.then((record) => {
			// if we didn't find a user with that email, send 401
			if (!record) {
				throw new BadCredentialsError()
			}
			// save the found user outside the promise chain
			user = record
			// `bcrypt.compare` will return true if the result of hashing `pw`
			// is exactly equal to the hashed password stored in the DB
			return bcrypt.compare(pw, user.hashedPassword)
		})
		.then((correctPassword) => {
			// if the passwords matched
			if (correctPassword) {
				// the token will be a 16 byte random hex string
				const token = crypto.randomBytes(16).toString('hex')
				user.token = token
				// save the token to the DB as a property on user
				return user.save()
			} else {
				// throw an error to trigger the error handler and end the promise chain
				// this will send back 401 and a message about sending wrong parameters
				throw new BadCredentialsError()
			}
		})
		.then((user) => {
			user.populate('pieces') // not currently populating as desired: but didn't break anything so leaving in for now to be used/ fixed later
			return user
		})
		.then((user) => {
			// return status 201, the email, and the new token
			res.status(201).json({ user: user.toObject() })
		})
		.catch(next)
}
module.exports = routerObj
