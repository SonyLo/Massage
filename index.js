const app = require('./app')
const port = process.env.port || 3000
const News = require('./models/news')




app.get("/", async(req, res)=>{
    const count_news= await News.find({}).count()
    const news = await News.find({}).skip(count_news-3)
    news.reverse()
    res.render('index.njk',{news});
})

app.get("/news", async(req, res)=>{
    const news = await News.find({})
    news.reverse()
    res.render('news.njk',{news});
})
// добавление новости
app.get('/get', async(req,res)=>{
    const news = await new News({
        linkPicture: 'img/uploads/file1.png',
        title: 'Новость №4',
        text: 'Текст новости №4'
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

app.listen(port, ()=> console.log(`Server started ${port}`))


