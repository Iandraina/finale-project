import express = require('express')
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')


const app = express()
/*const authRouter = express.Router()*/
const port: string = process.env.PORT || '3000'

//for body parser
app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

//template engine
app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

//setting the server up
app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`Server is running on http://localhost:${port}`)
  })

//home
app.get('/', (req: any, res: any) => {
    res.render('home')
})
app.get('/home', (req: any, res: any) => {
    res.render('home')
})

//login 
app.get('/login', (req: any, res: any) => {
    res.render('login')
})
// authRouter.get('/login', (req: any, res: any) => {
//     res.render('login')
//   })

//registration
app.get('/registration', (req: any, res: any) => {
    res.render('registration')
})

//signup
app.get('/signup', (req: any, res: any) => {
    res.render('registration')
})

//myMetrics
app.get('/myMetrics', (req: any, res: any) => {
    res.render('myMetrics')
})


module.exports = app;