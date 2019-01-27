const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  contactsSchema = new Schema({
   
    title:{
        type: String
    },
    description:{
        type: String
    }
    
   
})

module.exports = mongoose.model('contacts', contactsSchema)