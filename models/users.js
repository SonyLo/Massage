const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  usersSchema = new Schema({
   
    login:{
        type: String
    },
    password:{
        type: String
    }
    
   
})

module.exports = mongoose.model('users', usersSchema)