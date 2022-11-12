const mongoose = require('mongoose')

const userSchema = mongoose.Schema({
    fullName: {type: String, required: true, unique: false},
    emailAddress: {type: String, required: true, unique: true},
    username: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    confirmPassword: {type: String, required: true}
},
{ collection: 'User_Accounts'} 
)

const model = mongoose.model('UserSchema', userSchema)

module.exports = model