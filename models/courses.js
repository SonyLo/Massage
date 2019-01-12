const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  coursesSchema = new Schema({
   
    linkPicture:{
       type:String
    },
    title:{
        type: String
    },
    text:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    idTeacher:{
        type: Schema.Types.ObjectId, ref: 'teachers' 
    },
    price:{
        type: String
    },
    duration:{
        type: String
    }
    
   
})

module.exports = mongoose.model('courses', coursesSchema)