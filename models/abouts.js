const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  aboutsSchema = new Schema({
   
    linkIcon:{
        type:String
     },
    description:{
        type: String
    }
    
})

module.exports = mongoose.model('abouts', aboutsSchema)