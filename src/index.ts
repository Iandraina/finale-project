import express = require('express')
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import alert = require('alert-node')
import Router = require('router')
import User = require('../lib/user')
import { MetricsHandler } from './metrics'

const router = Router()
const app = express()
/*const authRouter = express.Router()*/
const port: string = process.env.PORT || '3000'

//sessions for tracking logins
app.use(session({
    secret: 'work hard',
    resave: true,
    saveUninitialized: false
}));

//connection to DB 
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/gfg');
var db = mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function (callback) {
    console.log("connection succeeded");
})

//for body parser
app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded({ extended: true }))


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



//registration page
app.get('/registration', (req: any, res: any) => {
    res.render('registration')
})

//login page
app.get('/login', (req: any, res: any) => {
    res.render('login')
})
app.post('/login', (req: any, res: any) => {
    var username = req.body.userName
    var password = req.body.pass

    User.findOne({ username: username, password: password }, function (err, user) {
        if (err) {
            console.log(err)
            return res.status(500).send()
        }

        if (!user) {
            console.log("identifiant non existant")
            res.render('login')
            return res.status(404).send()
        }

        //return res.status(200).send()
        res.render('myMetrics')
    })
})

//signup page
app.get('/signup', (req: any, res: any) => {
    res.render('registration')
})
app.post('/signup', (req: any, res: any) => {
    var firstName = req.body.fName
    var lastname = req.body.lName
    var username = req.body.userName
    var password = req.body.pass

    var newUser = new User()
    newUser.firstName = firstName
    newUser.lastname = lastname
    newUser.username = username
    newUser.password = password

    newUser.save(function (err, savedUser) {
        if (err) {
            console.log(err)
            return res.status(500).send();
        }
        else {
            res.render('myMetrics')
            return res.status(200).send();
        }
    })
})

//myMetrics page
app.get('/myMetrics', (req: any, res: any) => {
    res.render('myMetrics')
})
app.get('/metrics.json', (req: any, res: any) => {
    MetricsHandler.get((err: Error | null, result?: any) => {
        if (err) {
            throw err
        }
        res.json(result)
    })
})

//logout
router.get('/logout', function (req, res, next) {
    if (req.session) {
        // delete session object
        req.session.destroy(function (err) {
            if (err) {
                return next(err);
            } else {
                return res.redirect('/home');
            }
        });
    }
}),

    module.exports = app;