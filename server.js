const express=require('express')
const bcrypt=require('bcrypt')
const passport=require('passport')
const flash=require('express-flash')
const session=require('express-session')
const dotenv=require('dotenv/config')

const app=express()

app.use(express.urlencoded({extended:false}))

const users=[]

const initializePassport=require('./passport-config')

initializePassport(passport,
    email=>users.find(user=>user.email==email),
    id=>users.find(user=>user.id==id),
)


// view engine
app.set('view engine', 'ejs');
app.engine('ejs', require('ejs').__express);
app.use(flash())
app.use(session({
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
}))
app.use(passport.initialize())
app.use(passport.session())

app.get('/',(req,res)=>{
    res.render("index.ejs")
})

app.get('/login',(req,res)=>{
    res.render("login.ejs")
})
app.post('/login',passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFlash:true
}))
app.get('/register',(req,res)=>{
    res.render("register.ejs")
})

app.post('/register', async (req,res)=>{
    try {
        const hashedPAssword=await bcrypt.hash(req.body.password,10)
        users.push({
            id:Date.now().toString(),
            name:req.body.name,
            email:req.body.email,
            password:hashedPAssword
        })
        res.redirect('/login')
    } catch (err) {
        res.redirect('/register')
        console.log(err);
    }

    console.log(users)
})
app.listen(3000,()=>console.log('server started ....'))