const app = require('./app')
const port = process.env.port || 3000
const News = require('./models/news')




app.get("/", (req, res)=>{
    res.render('index.njk');
})

app.get("/news", (req, res)=>{
    res.render('news.njk');
})
// добавление новости
app.get('/get', async(req,res)=>{
    const news = await new News({
        linkPicture: 'uploads/file1.png',
        title: 'Новость №2',
        text: 'Текст новости №2'
    })
    try {
        news.save()
        console.log('Новость добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st:"Your order is accepted"})
})

app.get("/courses", (req, res)=>{
    res.render('news.njk');
})


app.listen(port, ()=> console.log(`Server started ${port}`))


