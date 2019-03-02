const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  commentsSchema = new Schema({
   
    linkPicture:{
        type:String
     },
    title:{
        type: String
    },
    text:{
        type: String
    }
    
})

module.exports = mongoose.model('comments', commentsSchema)