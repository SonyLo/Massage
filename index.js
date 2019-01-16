const app = require('./app')
const port = process.env.port || 3000
const moment = require('moment')
const bodyParser = require("body-parser");
const News = require('./models/news')
const Teachers=require('./models/teachers')
const Courses=require('./models/courses')



function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;
  
    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;
  
    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;
  
    return dd + '.' + mm + '.' + yy;
  }
app.get("/", async(req, res)=>{
    // вывод новостей
    const count_news= await News.find({}).count()
    let news={}
    var date=[]
    if(count_news<=3)
    {
        news = await News.find({})
    }
    else
    {
        news = await News.find({}).skip(count_news-3)
    }
    news.reverse()
    for (var i=0;i<news.length;i++)
    {
        date.push(moment(news[i].date).format('DD-MM-YYYY'))
    }
    // вывод преподавателей
    const teachers = await Teachers.find({})
    res.render('index.njk',{news,teachers,date})
})

app.get("/news", async(req, res)=>{
    const news = await News.find({})
    news.reverse()
    var date=[]
    for (var i=0;i<news.length;i++)
    {
        date.push(moment(news[i].date).format('DD-MM-YYYY'))
    }
    res.render('news.njk',{news,date})
})
// подробно новости
app.get("/news/detail",async(req,res)=>{
    const id=req.query.id
    const news = await News.findOne({_id:id})
    res.status(200).json({ st:"Your order is accepted"})
})
// добавление новости
app.get('/addNews', async(req,res)=>{
    const news = await new News({
        linkPicture: 'img/uploads/file1.png',
        title: 'Новость №5',
        text: 'Текст новости №5'
    })
    try {
        news.save()
        console.log('Новость добавлена')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st:"Your order is accepted"})
})
// добавление преподавателей
app.get('/addTeachers', async(req,res)=>{
    const teachers = await new Teachers({
        linkPicture: 'img/uploads/teacher1.png',
        name: 'Скрипник Маргарита Викторовна',
        description: 'Закончила Харьковский Национальный Медицинский Университет.'
    })
    try {
        teachers.save()
        console.log('Преподаватель добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st:"Your order is accepted"})
})
// добавление курсов для новичков
app.get('/addCoursesNew', async(req,res)=>{
    const courses = await new Courses({
        linkPicture: 'img/uploads/courseNew1.png',
        title: 'Курс новичков №5',
        text: 'На данном курсе вы научитесь основам массажа, а также...',
        idTeacher: await Teachers.findOne({'name':'Скрипник Маргарита Викторовна'}),
        date:new Date(Date.UTC(2019,1,27,0,0,0)),
        price: '6000р',
        duration: '8 месяц',
        forNewbies: 'true'
    })
    // нумерация месяца начинается с 0
    // года и числа адекватно
    // 27-01-2019 = 27-02-2019 (в бд)
    try {
        courses.save()
        console.log('Курс для новичков добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st:"Your order is accepted"})
})

app.get("/coursesNew", (req, res)=>{
    // Тут сделать выборку курсов для начинающих
    res.render('courses.njk');
})
app.get("/coursesOld", (req, res)=>{
    // Тут сделать выборку курсов для продолжающих
    res.render('courses.njk');
})
app.get("/teachers", (req, res)=>{
    // Преподы
    res.render('teacher.njk');
})
app.listen(port, ()=> console.log(`Server started ${port}`))


