const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose =require('mongoose')
const keys = require("./key")
const nunjucks = require('nunjucks')






mongoose.connect(keys.mongoURL)
.then(()=>{
    console.log('MongoDB connect')
})
.catch(err=>{
    console.log(err)// Можно сделать страницу ошибки 
})





app.use(require('morgan')('dev'))
app.use(express.static(__dirname + "/views"));
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

nunjucks.configure('views', {
    autoescape: true,
    express: app
});
module.exports = app
// app.use(passport.initialize())
// require('./middleware/passport')(passport) это для авторизации понадобиться 


// app.use('/api/auth', authRoutes)
// app.use('/api/analytics', analyticsRoutes)
// app.use('/api/category', categoryRoutes)
// app.use('/api/order', orderRoutes)
// app.use('/api/position', positionRoutes)
//app.use('/uploads', express.static('uploads')) это для загрузки файлов понадобиться
// const passport = require('passport')
// const authRoutes = require('./routes/auth')
// const analyticsRoutes = require('./routes/analytics')
// const categoryRoutes = require('./routes/category')
// const orderRoutes = require('./routes/order')
// const positionRoutes = require('./routes/position')
// const keys = require('./config/keys')
