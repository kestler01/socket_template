const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			unique: true,
		},
		username: {
			type: String,
			required: true,
			unique: true,
		},
		hashPassword: {
			type: String,
			required: true,
		},
		token: String, // will not need for basic auth but may need for reconnection goodness ...
		socket: {
			type: String,
			default: null
		}, // currently using socketID in place of token for basic auth
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		timestamps: true,
		toObject: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashPassword
				delete user.email
				return user
			},
		},
		toJson: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashPassword
				delete user.email
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
