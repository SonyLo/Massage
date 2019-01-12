const app = require('./app')
const port = process.env.port || 3000


app.get("/", (req, res)=>{
    res.sendFile('index.html');
})

app.listen(port, ()=> console.log(`Server started ${port}`))
