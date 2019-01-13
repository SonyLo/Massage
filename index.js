const app = require('./app')
const port = process.env.port || 3000




app.get("/", (req, res)=>{
    res.render('index.njk');
})

app.get("/news", (req, res)=>{
    res.render('news.njk');
})

app.listen(port, ()=> console.log(`Server started ${port}`))


