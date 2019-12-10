import express = require('express')
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import alert = require('alert-node') 
import { MetricsHandler } from './metrics'

const app = express()
/*const authRouter = express.Router()*/
const port: string = process.env.PORT || '3000'

//for body parser
app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({extended : false}))


//template engine
app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

//setting the server up
app.listen(port, (err: Error) => {
    if (err) throw err
    console.log(`Server is running on http://localhost:${port}`)
  })

//home page
app.get('/', (req: any, res: any) => {
    res.render('home')
})
app.get('/home', (req: any, res: any) => {
    res.render('home')
})

//login page
app.get('/login', (req: any, res: any) => {
    res.render('login')
})
app.post('/login', (req: any, res: any) => {
    if(req.body.userName === "iandraina" && req.body.pass === "iandrainarave0507"){
        res.render('myMetrics')
    }
    else{
        console.log("the username or password is not correct")
        res.render('login')
    }
})

//registration page
app.get('/registration', (req: any, res: any) => {
    res.render('registration')
})

//signup page
app.get('/signup', (req: any, res: any) => {
    res.render('registration')
})
app.post('/signup', (req: any, res: any) => {
    if(req.body.userName != "iandraina" ){
        res.render('myMetrics')
    }
    else{
        console.log("The username you enter is already used!")
        res.render('registration')
    }
})

//myMetrics page
app.get('/myMetrics', (req: any, res: any) => {
    res.render('myMetrics')
})
app.get('/login', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
      if (err) {
        throw err
      }
      res.json(result)
    })
  })

module.exports = app;