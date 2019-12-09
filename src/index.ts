import express = require('express')
import path = require('path')
import bodyparser = require('body-parser')
import session = require('express-session')



const app = express()
/*const authRouter = express.Router()*/
const port: string = process.env.PORT || '3000'

module.exports = function (app, passport) {
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
        res.render('login', { message: req.flash('loginMessage') })
    })

    app.post('/login', passport.authenticate('local-login',{
        successRedirect : '/myMetrics',
        failureRedirect : '/login',
        failureFlash: true
    }),
        function(req, res){
            if(req.body.remember){
                req.session.cookie.maxAge = 1000 * 60 * 3
            }
            else{
                req.session.cookie.expires = false
            }
            res.redirect('/')
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
        res.render('registration', {message: req.flash('signupMessage')})
    })
    
    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/myMetrics',
        failureRedirect : '/registration',
        failureFlash : true
    }))


    //myMetrics
    app.get('/myMetrics', isLoggedIn, (req: any, res: any) => {
        res.render('myMetrics', {
            user:req.user
        })
    })

    //logout
    app.get('logout', function(req,res){
        req.logout()
        res.redirect('/home')
    })

    function isLoggedIn(req, res, next){
        if(req.isAuthenticated())
            return next();
        
        res.redirect('/home')
    }
}
