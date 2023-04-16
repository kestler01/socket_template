const bcrypt = require('bcrypt')
const bcryptSaltRounds = 10

const {BadParamsError} = require('../lib/custom_errors')
const User = require('../models/user')

const routerObj = {}

routerObj['signup'] = ( req, io, socketId, next ) => {
    console.log('line 10 of user Routes',req)//{ token: null, email: 'a@a.com', pw: 'a', pwConfirmation: 'a' }
    
    Promise.resolve(req)
        .then((creds) => {
            console.log(creds)
            if ( // we want ot make sure that we have valid creds first
                !creds ||
                !creds.password ||
                creds.password !== creds.passwordConfirmation
            ) {
                console.log(creds)
                throw new BadParamsError() // error handling not yet implemented
            }
        })
        // generate a hash from the provided password
        .then(() => bcrypt.hash(req.password, bcryptSaltRounds))
        .then((hash) => {
            // return necessary params to create a user
            return {
                email: req.email,
                hashPassword: hash,
            }
        })
        // create user with provided email and hashed password
        .then((user) => User.create(user))
        // send the new user object back with status 201, but `hashedPassword`
        // won't be send because of the `transform` in the User model
        .then((user) => {console.log(user)
            io.emit('sign-up-success', user)})
        // pass any errors along to the error handler
        .catch((error)=>{next(error, io, socketId)})
}

module.exports = routerObj