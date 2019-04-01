const mongoose = require('mongoose')
const Schema = mongoose.Schema

const  servicesSchema = new Schema({
   
    linkPicture:{
       type:String
    },
    title:{
        type: String
    },
    text:{
        type: String
    },
    price:{
        type: String
    },
    date:{
        type: Date,
        default: Date.now
    },
    
   
})

module.exports = mongoose.model('services', servicesSchema)