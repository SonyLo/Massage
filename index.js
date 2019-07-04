const app = require('./app')
const port = process.env.PORT || 3000
const moment = require('moment')
const passport = require('passport')
const News = require('./models/news')
const Teachers = require('./models/teachers')
const Courses = require('./models/courses')
const Contacts = require('./models/contacts')
const About = require('./models/abouts')
const AboutCourses = require('./models/about_courses')
const Comments = require('./models/comments')
const Products = require('./models/products')
const Services = require('./models/services')
const User = require('./models/users')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const upload = require('./mid/upload')
const fs = require('fs')
let com_elem = 1
var cloudinary = require('cloudinary')

app.use(passport.initialize())
require('./mid/passport')(passport)


function formatDate(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return dd + '.' + mm + '.' + yy;
}
function formatDateAdmin(date) {

    var dd = date.getDate();
    if (dd < 10) dd = '0' + dd;

    var mm = date.getMonth() + 1;
    if (mm < 10) mm = '0' + mm;

    var yy = date.getFullYear();
    if (yy < 10) yy = '0' + yy;

    return yy + '-' + mm + '.' + dd;
}
app.get("/", async (req, res) => {
    // вывод новостей
    const count_news = await News.find({}).count()
    let news = {}
    let comments = {}
    let slider = {}
    let slider_active = {}
    let show_btn = false
    const about = await About.find({})
    const course_new = await AboutCourses.findOne({})
    const course_old = await AboutCourses.findOne({}).skip(1)
    const count_comment = await Comments.find({}).count()
    if (count_comment <= 3) {
        comments = await Comments.find({}).sort('-date')
    }
    else {
        comments = await Comments.find({}).sort('-date').limit(3)
        show_btn = true
    }
    var date = []
    if (count_news <= 3) {
        news = await News.find({})
    }
    else {
        news = await News.find({}).sort('-date').limit(3)
    }
    if (count_news <= 1) {
        slider_active = await News.find({}).sort('-date')
    }
    else {
        if (count_news <= 5) {
            slider_active = await News.find({}).sort('-date').limit(1)
            slider = await News.find({}).sort('-date').skip(1)
        }
        else {
            slider_active = await News.find({}).sort('-date').limit(1)
            slider = await News.find({}).sort('-date').skip(1).limit(4)
        }
    }
    //news.reverse()
    for (var i = 0; i < news.length; i++) {
        date.push(moment(news[i].date).format('DD-MM-YYYY'))
    }
    // вывод преподавателей
    const teachers = await Teachers.find({})

    res.render('index.njk', { news, teachers, date, slider_active, slider, about, course_new, course_old, comments, show_btn })
})

app.post("/showComment", async (req, res) => {
    com_elem = com_elem + 1
    const count_comment = await Comments.find({}).count()
    if (count_comment <= (com_elem * 3)) {
        comments = await Comments.find({}).sort('-date').skip((com_elem - 1) * 3)
        show_btn = false
    }
    else {
        comments = await Comments.find({}).sort('-date').skip((com_elem - 1) * 3).limit(3)
        show_btn = true
    }
    res.json({ comments, show_btn })
})
app.post("/saveComment", upload.single('com_img'), async (req, res) => {

    // const i = date-file.originalname
    if (req.file) {
        cloudinary.uploader.upload(req.file.path,
            async function (result) {

                const comment = new Comments({
                    linkPicture: result.url,
                    title: req.body.com_title,
                    text: req.body.com_text,
                })
                try {
                    await comment.save()
                    res.redirect("/")
                } catch (e) {
                    res.status(501).json({
                        status: "bad"
                    })
                }

            })
    } else {
        const comment = new Comments({

            title: req.body.com_title,
            text: req.body.com_text,
        })
        try {
            await comment.save()
            res.redirect("/")
        } catch (e) {
            res.status(501).json({
                status: "bad"
            })
        }
    }



})

app.get('/news/story/:page', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let news = await News.find({}).sort('-date').skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await News.count()
    var date = []
    for (var i = 0; i < news.length; i++) {
        date.push(moment(news[i].date).format('DD-MM-YYYY'))
    }

    res.render('news.njk', { news, date, current: page, pages: Math.ceil(count / perPage) })

})
app.get('/news/story', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let news = await News.find({}).sort('-date').skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await News.count()
    var date = []
    for (var i = 0; i < news.length; i++) {
        date.push(moment(news[i].date).format('DD-MM-YYYY'))
    }

    res.render('news.njk', { news, date, current: page, pages: Math.ceil(count / perPage) })

})


// подробно новости
app.get("/news/detail", async (req, res) => {
    const id = req.query.id
    const news = await News.findOne({ _id: id })
    const date = moment(news.date).format('DD-MM-YYYY')
    const dateStart = moment(news.dateStart).format('DD-MM-YYYY')
    console.log(date)
    console.log(dateStart)
    res.render('news_detail.njk', { news, date, dateStart })
})
// добавление новости
app.get('/addNews', async (req, res) => {
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
    res.status(200).json({ st: "Your order is accepted" })
})
app.get('/courses/new/:page', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let courses_new = await Courses.find({}).sort('-date').where({ forNewbies: true }).skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await Courses.where({ forNewbies: true }).count()
    var date = []
    for (var i = 0; i < courses_new.length; i++) {
        date.push(moment(courses_new[i].date).format('DD-MM-YYYY'))
    }

    res.render('courses_new.njk', { courses_new, date, current: page, pages: Math.ceil(count / perPage) })

})
app.get('/courses/new', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let courses_new = await Courses.find({}).sort('-date').where({ forNewbies: true }).skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await Courses.where({ forNewbies: true }).count()
    var date = []
    for (var i = 0; i < courses_new.length; i++) {
        date.push(moment(courses_new[i].date).format('DD-MM-YYYY'))
    }

    res.render('courses_new.njk', { courses_new, date, current: page, pages: Math.ceil(count / perPage) })

})
// подробно курсы для новичков
app.get("/coursesNew/detail", async (req, res) => {
    const id = req.query.id
    const courses = await Courses.findOne({ _id: id })
    const date = moment(courses.date).format('DD-MM-YYYY')
    const teacher = await Teachers.findOne({ _id: courses.idTeacher })
    res.render('courses_detail.njk', { courses, date, teacher })
})
app.get('/courses/old/:page', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let courses_old = await Courses.find({}).sort('-date').where({ forNewbies: false }).skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await Courses.where({ forNewbies: false }).count()
    var date = []
    for (var i = 0; i < courses_old.length; i++) {
        date.push(moment(courses_old[i].date).format('DD-MM-YYYY'))
    }

    res.render('courses_old.njk', { courses_old, date, current: page, pages: Math.ceil(count / perPage) })

})
app.get('/courses/old', async (req, res) => {
    const perPage = 6
    let page = req.params.page || 1
    let courses_old = await Courses.find({}).sort('-date').where({ forNewbies: false }).skip((perPage * page) - perPage).limit(perPage)
    // news.reverse()
    let count = await Courses.where({ forNewbies: false }).count()
    var date = []
    for (var i = 0; i < courses_old.length; i++) {
        date.push(moment(courses_old[i].date).format('DD-MM-YYYY'))
    }

    res.render('courses_old.njk', { courses_old, date, current: page, pages: Math.ceil(count / perPage) })

})
// подробно курсы для продвинутых
app.get("/coursesOld/detail", async (req, res) => {
    const id = req.query.id
    const courses = await Courses.findOne({ _id: id })
    const date = moment(courses.date).format('DD-MM-YYYY')
    res.render('courses_detail.njk', { courses, date })
})
// добавление информации О нас
app.get('/addAbout', async (req, res) => {
    const about = await new About({
        linkIcon: 'fa fa-graduation-cap fa-5x',
        description: 'Наша школа работает со многими салонами, фитнес центрами и тед. учреждениями'
    })
    try {
        about.save()
        console.log('Информация добавлена')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление информации О курсах
app.get('/addAboutCourses', async (req, res) => {
    const about_courses = await new AboutCourses({
        linkIcon: 'fa fa-arrow-circle-o-up fa-5x',
        title: 'Курсы для повышения квалификации',
        description: 'На данном курсе мастера смогут узнать о новых техниках и приёмах'
    })
    try {
        about_courses.save()
        console.log('Информация о курсе добавлена')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление преподавателей
app.get('/addTeachers', async (req, res) => {
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
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление контактов
app.get('/addContacts', async (req, res) => {
    const contacts = await new Contacts({
        title: 'Напишите нам',
        description: 'Sfera_Email@gmail.com'
    })
    try {
        contacts.save()
        console.log('Контакт добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление товаров
app.get('/addProducts', async (req, res) => {
    const products = await new Products({
        linkPicture: 'img/uploads/courseNew1.png',
        title: 'Массажное масло',
        text: '',
        price: '2000'
    })
    try {
        products.save()
        console.log('Товар добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление услуг
app.get('/addServices', async (req, res) => {
    const services = await new Services({
        linkPicture: 'img/uploads/courseNew1.png',
        title: 'Массажное масло',
        text: '',
        price: '2000'
    })
    try {
        services.save()
        console.log('Услуга добавлена')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление отзывов
app.get('/addComments', async (req, res) => {
    const comments = await new Comments({
        linkPicture: 'img/uploads/Comment.png',
        title: '',
        text: 'Хотела порадовать вас, в Болгарии работаю в отеле массажистом. Официально трудоустроилась. Нашла свое место — это курорты. Диплом школы и навыки пригодились. Думаю по осени ещё что нибудь пройти у вас. Всем рекомендую школу.'
    })
    try {
        comments.save()
        console.log('Отзыв добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})
// добавление курсов для новичков
app.get('/addCourses', async (req, res) => {
    const courses = await new Courses({
        linkPicture: 'img/uploads/courseNew1.png',
        title: 'Курс повышения квалификации №7',
        text: 'На данном курсе вы научитесь новым техникам, а также...',
        idTeacher: await Teachers.findOne({ 'name': 'Скрипник Маргарита Викторовна' }),
        date: new Date(Date.UTC(2019, 2, 18, 0, 0, 0)),
        price: '12000р',
        duration: '8 месяц',
        forNewbies: 'false'
    })
    // нумерация месяца начинается с 0
    // года и числа адекватно
    // 27-01-2019 = 27-02-2019 (в бд)
    try {
        courses.save()
        console.log('Курс добавлен')
    }
    catch (e) {
        console.log(e)
    }
    res.status(200).json({ st: "Your order is accepted" })
})

app.get("/teachers", async (req, res) => {
    teachers = await Teachers.find({})
    console.log(teachers)
    res.render('teacher.njk', { teachers });
})
// контакты

app.get("/contact", async (req, res) => {
    contacts = await Contacts.find({})
    let call = []
    let workTime = []
    let address = []
    let send = []
    for (var i = 0; i < contacts.length; i++) {
        if (contacts[i].title == 'Звоните нам') {
            call.push(contacts[i].description)
        }
        if (contacts[i].title == "Часы работы") {
            workTime.push(contacts[i].description)
        }
        if (contacts[i].title == "Мы находимся") {
            address.push(contacts[i].description)
        }
        if (contacts[i].title == "Напишите нам") {
            send.push(contacts[i].description)
        }
    }
    res.render('contact.njk', { call, workTime, address, send });
})
app.get("/schedule", async (req, res) => {
    // расписание
    res.render('schedule.njk');
})

app.get("/product", async (req, res) => {
    const prod = await Products.find({})
    const head = 'Товары'
    const id = 'liProd'
    res.render('product.njk', { prod, head, id });
})
app.get("/service", async (req, res) => {
    const prod = await Services.find({})
    const head = 'Услуги'
    const id = 'liService'
    res.render('product.njk', { prod, head, id });
})


app.get("/a", async (req, res) => {

    res.render('auth.njk');
})

app.post("/a", async (req, res) => {

    //console.log("dfs")
    const candidate = await User.findOne({ login: req.body.login })

    if (candidate) {
        // Проверка пароля, пользователь существует
        const passwordResult = bcrypt.compareSync(req.body.pass, candidate.password)

        if (passwordResult) {
            // Генерация токена, пароли совпали
            console.log(candidate._id)
            const token = jwt.sign({
                login: candidate.login,
                userId: candidate._id
            }, "dev-jwt", { expiresIn: 60 * 60 })

            //   req.headers['Authorization'] = `bearer ${token}`
            res.cookie('auth', token);
            res.status(200).json({
                token: `bearer ${token}`
            })
        } else {
            // Пароли не совпали

            res.status(401).json({
                message: 'Пароли не совпадают. Попробуйте снова.'
            })
        }
    } else {
        // Пользователя нет, ошибка
        res.status(404).json({
            message: 'Пользователь с таким логином не найден.'
        })
    }




})

function authh(req, res) {

    var token = req.cookies.auth;

    // decode token
    if (token) {

        jwt.verify(token, "dev-jwt", function (err, token_data) {
            if (err) {
                return 0
            } else {
                req.user_data = token_data;
                return 1
            }
        });

    } else {
        return 0;
    }
}



app.get("/reg", async (req, res) => {
    const salt = bcrypt.genSaltSync(10)
    // const password = req.body.password
    const password = "111"
    const user = new User({
        login: "sss",
        password: bcrypt.hashSync(password, salt)
    })
    try {
        await user.save()
        res.status(201).json(user)
    } catch (e) {
        // Обработать ошибку
        console.log("не добавился")
    }


})


//новости на админ-панели
app.get("/adminNews", async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        let news = await News.find({}).sort('-date')
        var date = []
        var dateStart = []
        var dateIn = []
        for (var i = 0; i < news.length; i++) {
            date.push(moment(news[i].date).format('DD-MM-YYYY'))
            dateStart.push(moment(news[i].dateStart).format('DD-MM-YYYY'))
            dateIn.push(moment(news[i].dateStart).format('YYYY-MM-DD'))
        }
        res.render('adminTables/adminNews.njk', { news, date, dateStart, dateIn });
    }
    else {
        //res.send("Nooooo")
        res.redirect("/a")
    }


})

app.post("/adminNews", upload.single('image'), async (req, res) => {


    authh(req, res)
    if (req.user_data) {
        var d = req.body.dateNews
        var dd = d.split('-')
        var ddd = new Date(Date.UTC(parseInt(dd[0]), parseInt(dd[1]) - 1, parseInt(dd[2])))
        if (req.body.IDforSearch) {
            const candidate = await News.findById(req.body.IDforSearch)
            if (candidate) {

                const updated = {
                    title: req.body.titleNews,
                    dateStart: ddd,
                    text: req.body.description,
                }
                if (req.file) {
                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            updated.linkPicture = result.url
                        })

                }

                try {
                    const news = await News.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminNews")
                }
                catch (e) {
                    console.log(e)
                }

            }



        }

        else {
            if (req.file) {
                cloudinary.uploader.upload(req.file.path,
                    async function (result) {
                        // updated.linkPicture = result.url
                        const news = new News({
                            // linkPicture: req.file ? req.file.path : '',
                            linkPicture: result.url,
                            title: req.body.titleNews,
                            dateStart: ddd,
                            text: req.body.description,
                            date: Date.now()
                        })
                        try {
                            await news.save()
                            res.redirect("/adminNews")
                        } catch (e) {
                            res.status(501).json({
                                status: "bad"
                            })
                        }
                    })
            } else {
                const news = new News({
                    // linkPicture: req.file ? req.file.path : '',

                    title: req.body.titleNews,
                    dateStart: ddd,
                    text: req.body.description,
                    date: Date.now()
                })
                try {
                    await news.save()
                    res.redirect("/adminNews")
                } catch (e) {
                    res.status(501).json({
                        status: "bad"
                    })
                }
            }


        }

    }
    else {
        res.send("Nooooo")
    }


})
app.get("/adminNewsDelete", async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        const id = req.query.idDelete
        let can = await News.findById({ _id: id })
        console.log(can.linkPicture)
        fs.unlink(can.linkPicture, (err) => {
            if (err) console.log(err);
            console.log('successfully deleted ' + can.linkPicture);
        });
        let news = await News.findByIdAndDelete({ _id: id })
        try {
            await news.save()
            res.redirect("/adminNews")
        } catch (e) {
            res.status(501).json({
                status: "bad"
            })
        }
    }
    else {
        res.send("Nooooo")
    }


})



app.get("/adminCourses", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        let courses = await Courses.find({}).sort('-date')
        var date = []
        var dateIn = []
        var teacher = []
        let teachers = await Teachers.find({})
        for (var i = 0; i < courses.length; i++) {
            date.push(moment(courses[i].date).format('DD-MM-YYYY'))
            dateIn.push(moment(courses[i].date).format('YYYY-MM-DD'))
            teacher.push(await Teachers.findOne({ _id: courses[i].idTeacher }))
        }
        res.render('adminTables/adminCourses.njk', { courses, date, teacher, teachers, dateIn });
    }
    else {
        // res.send("Nooooo")
        res.redirect("/a")
    }

})


app.post("/adminCourses", upload.single('image'), async (req, res) => {
    authh(req, res)
    if (req.user_data) {

        if (req.body.IDforSearch) {
            const candidate = await Courses.findById(req.body.IDforSearch)
            if (candidate) {
                // var d=req.body.dateStart
                // var dd=d.split('-')
                // var ddd=new Date(Date.UTC(parseInt(dd[0]),parseInt(dd[1])-1,parseInt(dd[2])))
                let updated;
                if (req.body.level == 1) {
                    updated = {
                        title: req.body.courseName,
                        text: req.body.courseDescription,
                        // date:ddd,
                        idTeacher: await Teachers.findOne({ '_id': req.body.teacher }),
                        price: req.body.price,
                        duration: req.body.duration,
                        forNewbies: 'true'
                    }
                }
                else {
                    updated = {
                        linkPicture: req.file ? req.file.path : "",
                        title: req.body.courseName,
                        text: req.body.courseDescription,
                        // date:ddd,
                        idTeacher: await Teachers.findOne({ '_id': req.body.teacher }),
                        price: req.body.price,
                        duration: req.body.duration,
                        forNewbies: 'false'
                    }
                }
                if (req.file) {
                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            updated.linkPicture = result.url
                        })
                }

                try {
                    const courses = await Courses.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminCourses")
                }
                catch (e) {
                    console.log(e)
                }

            }
        }

        else {
            // var d=req.body.dateStart
            // var dd=d.split('-')
            // var ddd=new Date(Date.UTC(parseInt(dd[0]),parseInt(dd[1])-1,parseInt(dd[2])))
            var te = await Teachers.findOne({ _id: req.body.teacher })
            let courses
           
            if (req.body.level == 1) {
                if (req.file) {
                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            courses = new Courses({
                                linkPicture: result.url,
                                title: req.body.courseName,
                                text: req.body.courseDescription,
                                // date:ddd,
                                idTeacher: await Teachers.findOne({ '_id': req.body.teacher }),
                                price: req.body.price,
                                duration: req.body.duration,
                                forNewbies: 'true'
                            })
                        })
                }
                else{
                    courses = new Courses({
                        
                        title: req.body.courseName,
                        text: req.body.courseDescription,
                        // date:ddd,
                        idTeacher: await Teachers.findOne({ '_id': req.body.teacher }),
                        price: req.body.price,
                        duration: req.body.duration,
                        forNewbies: 'true'
                    })
                }
               
                console.log(courses)
            }
            else {
                courses = new Courses({
                    linkPicture: req.file.path,
                    title: req.body.courseName,
                    text: req.body.courseDescription,
                    // date:ddd,
                    idTeacher: await Teachers.findOne({ '_id': req.body.teacher }),
                    price: req.body.price,
                    duration: req.body.duration,
                    forNewbies: 'false'
                })
                console.log(courses)
            }
            try {
                await courses.save()
                res.redirect("/adminCourses")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }

    }
    else {
        res.send("Nooooo")
    }
})
app.get("/adminCoursesDelete", async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        if (req.query.idDelete) {
            const id = req.query.idDelete

            let can = await Courses.findById({ _id: id })
            console.log(can.linkPicture)
            fs.unlink(can.linkPicture, (err) => {
                if (err) console.log(err);
                console.log('successfully deleted ' + can.linkPicture);
            });

            let courses = await Courses.findByIdAndDelete({ _id: id })
            try {
                await courses.save()
                res.redirect("/adminCourses")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }
        else {
            res.send("Nooooo")
        }

    }

    else {
        res.send("Nooooo")
    }


})


app.get("/adminTeacher", async (req, res) => {
    authh(req, res)
    const teachers = await Teachers.find({})
    if (req.user_data) {
        res.render('adminTables/adminTeacher.njk', { teachers });
    }
    else {
        res.send("Nooooo")
    }
})
app.post("/adminTeacher", upload.single('image'), async (req, res) => {
    authh(req, res)
    if (req.user_data) {

        if (req.body.IDforSearch) {
            const candidate = await Teachers.findById(req.body.IDforSearch)
            if (candidate) {
                const updated = {
                    name: req.body.nameTeacher,
                    description: req.body.description
                }
                if (req.file) {
                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            updated.linkPicture = result.url
                        })

                }

                try {
                    const teachers = await Teachers.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminTeacher")
                }
                catch (e) {
                    console.log(e)
                }

            }
        }

        else {
            if (req.file) {
                cloudinary.uploader.upload(req.file.path,
                    async function (result) {
                        // updated.linkPicture = result.url
                        const teacher = new Teachers({
                            linkPicture: result.url,
                            name: req.body.nameTeacher,
                            description: req.body.description
                        })
                        try {
                            await teacher.save()
                            res.redirect("/adminTeacher")
                        } catch (e) {
                            res.status(501).json({
                                status: "bad"
                            })
                        }
                    })
            } else {
                const teacher = new Teachers({
                  
                    name: req.body.nameTeacher,
                    description: req.body.description
                })
                try {
                    await teacher.save()
                    res.redirect("/adminTeacher")
                } catch (e) {
                    res.status(501).json({
                        status: "bad"
                    })
                }
            }


        }

    }
    else {
        res.send("Nooooo")
    }
})

app.get("/adminTeacherDelete", async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        if (req.query.idDelete) {
            const id = req.query.idDelete
            let can = await Teachers.findById({ _id: id })
            console.log(can.linkPicture)
            fs.unlink(can.linkPicture, (err) => {
                if (err) console.log(err);
                console.log('successfully deleted ' + can.linkPicture);
            });
            let teacher = await Teachers.findByIdAndDelete({ _id: id })
            try {
                await teacher.save()
                res.redirect("/adminTeacher")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }
        else {
            res.send("Nooooo")
        }
    }
    else {
        res.send("Nooooo")
    }


})

app.get("/adminProduct", async (req, res) => {
    authh(req, res)
    const products = await Products.find({})
    if (req.user_data) {
        res.render('adminTables/adminProduct.njk', { products });
    }
    else {
        res.send("Nooooo")
    }
})
app.post("/adminProduct", upload.single('image'), async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        if (req.body.IDforSearch) {
            const candidate = await Products.find({ _id: req.body.IDforSearch })
            console.log('111')
            if (candidate) {
                console.log('222')
                const updated = {
                    title: req.body.title,
                    text: req.body.text,
                    price: req.body.price,
                }
                if (req.file) {
                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            updated.linkPicture = result.url
                        })
                }

                try {
                    const products = await Products.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminProduct")
                }
                catch (e) {
                    console.log(e)
                }

            }
            else {
                res.send("Nooooo")
            }
        }
        else {
            if(req.file){
                cloudinary.uploader.upload(req.file.path,
                    async function (result) {
                        // updated.linkPicture = result.url
                        const product = new Products({
                            linkPicture: result.url,
                            title: req.body.title,
                            text: req.body.text,
                            price: req.body.price,
                        })
                        console.log(product)
                        try {
                            await product.save()
                            res.redirect("/adminProduct")
                        } catch (e) {
                            res.status(501).json({
                                status: "bad"
                            })
                        }
                    })
            }else{
                const product = new Products({
                    
                    title: req.body.title,
                    text: req.body.text,
                    price: req.body.price,
                })
                console.log(product)
                try {
                    await product.save()
                    res.redirect("/adminProduct")
                } catch (e) {
                    res.status(501).json({
                        status: "bad"
                    })
                }
            }
           

        }

    }
    else {
        res.send("Nooooo")
    }
})

app.get("/adminProductDelete", async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        if (req.query.idDelete) {
            const id = req.query.idDelete
            let can = await Products.findById({ _id: id })
            console.log(can.linkPicture)
            fs.unlink(can.linkPicture, (err) => {
                if (err) console.log(err);
                console.log('successfully deleted ' + can.linkPicture);
            });
            let products = await Products.findByIdAndDelete({ _id: id })
            try {
                await products.save()
                res.redirect("/adminProduct")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }
        else {
            res.send("Nooooo")
        }
    }
    else {
        res.send("Nooooo")
    }


})


app.get("/adminContact", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        const contacts = await Contacts.find({})
        res.render('adminTables/adminContact.njk', { contacts });
    }
    else {
        res.send("Nooooo")
    }

})
app.post("/adminContact", async (req, res) => {

    authh(req, res)
    if (req.user_data) {

        if (req.body.IDforSearch) {
            const candidate = await Contacts.findById(req.body.IDforSearch)
            if (candidate) {
                const updated = {
                    title: req.body.typeContact,
                    description: req.body.description,
                }


                try {
                    const contacts = await Contacts.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminContact")
                }
                catch (e) {
                    console.log(e)
                }

            }
        }
        else {

            const contacts = new Contacts({
                title: req.body.typeContact,
                description: req.body.description
            })
            try {
                await contacts.save()
                res.redirect("/adminContact")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }

    }
    else {
        res.send("Nooooo")
    }

})
app.get("/adminContactDelete", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        const id = req.query.idDelete
        let contacts = await Contacts.findByIdAndDelete({ _id: id })
        try {
            await contacts.save()
            res.redirect("/adminContact")
        } catch (e) {
            res.status(501).json({
                status: "bad"
            })
        }
    }
    else {
        res.send("Nooooo")
    }


})


app.get("/adminService", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        const services = await Services.find({})
        res.render('adminTables/adminService.njk', { services });
    }
    else {
        res.send("Nooooo")
    }

})
app.get("/adminComment", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        const comments = await Comments.find({}).sort('-date')
        res.render('adminTables/adminComment.njk', { comments });
    }
    else {
        res.send("Nooooo")
    }

})
app.get("/adminCommentDelete", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        if (req.query.idDelete) {
            const id = req.query.idDelete
            let can = await Comments.findById({ _id: id })
            console.log(can.linkPicture)
            fs.unlink(can.linkPicture, (err) => {
                if (err) console.log(err);
                console.log('successfully deleted ' + can.linkPicture);
            });

            let comment = await Comments.findByIdAndDelete({ _id: id })
            try {
                await comment.save()
                res.redirect("/adminComment")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }
        else {
            res.send("Nooooo")
        }
    }
    else {
        res.send("Nooooo")
    }


})
app.post("/adminService", upload.single('image'), async (req, res) => {

    authh(req, res)
    if (req.user_data) {
        if (req.body.IDforSearch) {
            const candidate = await Services.findById(req.body.IDforSearch)
            if (candidate) {
                const updated = {
                    title: req.body.title,
                    text: req.body.text,
                    price: req.body.price,
                }
                console.log(req.file.path)
                console.log(11111)
                if (req.file) {

                    cloudinary.uploader.upload(req.file.path,
                        async function (result) {
                            updated.linkPicture = result.url
                        })
                }

                try {
                    const services = await Services.findOneAndUpdate({ _id: req.body.IDforSearch }, { $set: updated }, { new: true })
                    res.redirect("/adminService")
                }
                catch (e) {
                    console.log(e)
                }

            }
            else {
                res.send("Nooooo")
            }
        }
        else {
            if (req.file) {
                cloudinary.uploader.upload(req.file.path,
                    async function (result) {
                        // updated.linkPicture = result.url
                        const services = new Services({
                            linkPicture: result.url,
                            title: req.body.title,
                            text: req.body.text,
                            price: req.body.price,
                        })
                        try {
                            await services.save()
                            res.redirect("/adminService")
                        } catch (e) {
                            res.status(501).json({
                                status: "bad"
                            })
                        }
                    })
            }
            else {
                const services = new Services({

                    title: req.body.title,
                    text: req.body.text,
                    price: req.body.price,
                })
                try {
                    await services.save()
                    res.redirect("/adminService")
                } catch (e) {
                    res.status(501).json({
                        status: "bad"
                    })
                }
            }



        }

    }
    else {
        res.send("Nooooo")
    }

})
app.get("/adminServiceDelete", async (req, res) => {
    authh(req, res)
    if (req.user_data) {
        if (req.query.idDelete) {
            const id = req.query.idDelete
            let can = await Services.findById({ _id: id })
            console.log(can.linkPicture)
            fs.unlink(can.linkPicture, (err) => {
                if (err) console.log(err);
                console.log('successfully deleted ' + can.linkPicture);
            });

            let services = await Services.findByIdAndDelete({ _id: id })
            try {
                await services.save()
                res.redirect("/adminService")
            } catch (e) {
                res.status(501).json({
                    status: "bad"
                })
            }
        }
        else {
            res.send("Nooooo")
        }
    }
    else {
        res.send("Nooooo")
    }


})


app.post("/NewsUpdate", async (req, res) => {
    console.log("dskjksdlk")
})
app.post("/ContactUpdate", async (req, res) => {
    console.log("dskjksdlk")
})
app.post("/ProductUpdate", async (req, res) => {
    console.log("dskjksdlk")
})
app.post("/CourseUpdate", async (req, res) => {
    console.log("dskjksdlk")
})
app.post("/ServiceUpdate", async (req, res) => {
    console.log("dskjksdlk")
})


app.post("/exit", (req, res) => {

    res.cookie('auth', "");
    res.status(200).json({
        token: ""
    })
})


app.listen(port, () => console.log(`Server started ${port}`))


