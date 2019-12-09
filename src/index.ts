import  express = require ('express')
import path = require ('path')
import bodyparser = require('body-parser')
import session = require('express-session')


const app = express()
const authRouter = express.Router()

//for body parser
app.use(express.static(path.join(__dirname, '/../public')))
app.use(bodyparser.json())
app.use(bodyparser.urlencoded())

//template engine
app.set('views', __dirname + "/../views")
app.set('view engine', 'ejs');

//setting the server up
app.listen(3000, () => {
    console.log('Server is running on port 3000...');
})

//login 
app.get('/', (req: any, res: any) => {
    res.render('login')
  })
authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
  })
  
module.exports = app;