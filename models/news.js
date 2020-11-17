// const mongoose = require('mongoose')
// const Schema = mongoose.Schema

// const  newsSchema = new Schema({
   
//     linkPicture:{
//        type:String
//     },
//     title:{
//         type: String
//     },
//     text:{
//         type: String
//     },
//     date:{
//         type: Date,
//         default: Date.now
//     },
//     dateStart:{
//         type:Date,
//         default:Date.now
//     }
   
// })

// module.exports = mongoose.model('news', newsSchema)



const mongoose = require('mongoose')
  const { Schema } = mongoose;

  const newsSchema = new Schema({
    linkPicture:  String,
    title: String,
    text:   String,
    date: { type: Date, default: Date.now },
    dateStart: { type: Date, default: Date.now },
  });

  module.exports = mongoose.model('news', newsSchema)