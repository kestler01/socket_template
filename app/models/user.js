const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		email: {
			type: String,
			required: true,
			// unique: true
		},
		// userName: {
		// 	type: String,
		// 	required: true,
		// 	unique: true
		// },
		hashPassword: {
			type: String,
			required: true,
		},
		token: String,
		socket:String,
		friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
	},
	{
		timestamps: true,
		toObject: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashedPassword
				delete user.email
				return user
			},
		},
		toJson: {
			virtuals: true,
			transform: (_doc, user) => {
				delete user.hashedPassword
				delete user.email
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
