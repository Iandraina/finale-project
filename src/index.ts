import express = require('express')
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')
import alert = require('alert-node')
import { MetricsHandler } from './metrics'
import Router = require('router')

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
    if (db.collection('details').find({ "userName": req.body.userName })) {
        res.render('myMetrics')
    }
    else {
        console.log("the username or password is not correct")
        res.render('login')
    }
})
//signup page
app.get('/signup', (req: any, res: any) => {
    res.render('registration')
})
app.post('/signup', (req: any, res: any) => {
     //create schema
     var Schema = new mongoose.Schema({
        fName : String,
        lName : String,
        userName : {type: String, required: '{PATH} is required.', unique: true},
        password : String  
    });

    var User = mongoose.model('User', Schema);
    //add POST values to schema
    var us = new User({
        fName: req.body.fName,
        lName: req.body.lName,
        userName: req.body.userName,
        password: req.body.pass
    //store in database
    })
    us.save(function(err, doc) {
    if (err){
        res.redirect('/registration')
        alert('The username you entered is already use')
        throw err;
    }
    else{
        var ID = db.collection('users').findOne({userName:req.body.userName})._id
        console.log(ID)
        req.session.userId = ID 
        console.log('save user successfully...');
        res.render('myMetrics')
    } 
    });
    
    // if ((db.collection('details').find({ "userName": req.body.userName })) != null) {
    //     console.log("The username you enter is already used!")
    //     res.render('registration')
    // }
    // else {
    //     var fname = req.body.fname;
    //     var lName = req.body.lName;
    //     var userName = req.body.userName;
    //     var pass = req.body.pass;

    //     var data = {
    //         "firstName": fname,
    //         "lastName": lName,
    //         "userName": userName,
    //         "password": pass

    //     }
    //     db.collection('details').insertOne(data, function (err, collection) {
    //         if (err) throw err;
    //         console.log("Record inserted Successfully");

    //     });
    //     res.render('myMetrics')
    // }
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

//logout
router.get('/logout', function(req, res, next) {
    if (req.session) {
      // delete session object
      req.session.destroy(function(err) {
        if(err) {
          return next(err);
        } else {
          return res.redirect('/home');
        }
      });
    }
  }),

module.exports = app;