const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  commentsSchema = new Schema({
   
    linkPicture:{
        type:String,
        default: 'https://res.cloudinary.com/hv0k0blas/image/upload/v1605089216/ssfwzr0fcu4qss1a8rnb.png'
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
    }
    
})

module.exports = mongoose.model('comments', commentsSchema)