const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  about_coursesSchema = new Schema({
   
    linkIcon:{
        type:String
     },
    title:{
        type:String
     },
    description:{
        type: String
    }
    
})

module.exports = mongoose.model('about_courses', about_coursesSchema)