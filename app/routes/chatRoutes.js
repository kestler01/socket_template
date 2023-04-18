const User = require('../models/user')

const routerObj = {}
// demo route
// routerObj['<keyName>'] = async (data, io, socketId, next) => {
//     try {
//         console.log('do the thing')
//     } catch (error) {
//         next(error, io, socketId)
//     }
// }

routerObj['indexUsers'] = async (data, io, socketId, next) => {
    try {
        console.log('in index users')
        let users = await User.find({'socket' : {$ne: (null || socketId)}})
        console.log('users', users)
        io.to(socketId).emit('indexUsersSuccess', users )
    } catch (error) {
        next(error, io, socketId)
    }
}

module.exports = routerObj