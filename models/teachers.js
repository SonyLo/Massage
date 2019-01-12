const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  teachersSchema = new Schema({
   
    linkPicture:{
       type:String
    },
    name:{
        type: String
    },
    description:{
        type: String
    }
    
   
})

module.exports = mongoose.model('teachers', teachersSchema)