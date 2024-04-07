const express = require("express");
const mongoose = require("mongoose");

const port = 8080;
const app = express();
const methodOverride = require("method-override");
const data = require('./data/data');

app.set("view engine", "ejs");
const path= require("path");
//app.set("views", "./views/listings");

//app.use(express.static('./public'));
app.set("views", path.join(__dirname,"views/listings"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const engine = require("ejs-mate");
app.engine('ejs', engine);

const ErrorClass= require('./utils/errorclass')

const listing= require('./routes/listing');
const review= require('./routes/review');
const session= require("express-session");
const flash= require("connect-flash");
const passport= require("passport");
const User= require('./models/user.js')
const LocalStrategy = require('passport-local').Strategy;
// now we need to cinfigure passport

// thse means we are telling how users will be authenticated in your application,
// use static authenticate method of model in LocalStrategy
//passport.use(new LocalStrategy(User.authenticate()));
//passport.use(new LocalStrategy(User.authenticate()));
 ////The first line configures Passport to use the LocalStrategy, which is typically used for authenticating users based on locally stored credentials.
//local strategy is authenticating users based on a username and password stored locally within the application's database.
//passport.use(User.createStrategy()) //The line configures Passport to use a strategy specifically designed for creating (registering) new users and simultaneously authenticating them, typically used in registration routes.
// passport.amazonstategy for logining in users with amazon id

// use static serialize and deserialize of model for passport session support
//passport.serializeUser(User.serializeUser()); // defines how user information is stored in the session.
//passport.deserializeUser(User.deserializeUser()); //defines how user information is retrieved from the session.
// then use sesions
const sessionOptions = {
    secret: "mysecretkey",
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+15*24*60*60*1000,//// Expires after 21 days
        maxAge:21*24*60*60*1000, //// Expires after 21 days of inactivity
        httpOnly:true,


    }
};
app.use(flash())

app.use(session(sessionOptions));

app.use(express.json());

// then intiallize passport and sesion

app.use(passport.initialize());
app.use(passport.session());
// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
main()
    .then(() => {
        console.log("Connection Successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/listing');
}


app.get('/',async(req,res)=>{
    res.send("hi i am home");
})





app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.fail= req.flash("fail");
    
    next()
}) 

  



app.use('/listing',listing);//here meaning is konsi bhi requiest /listing kaan aiye tho it will pass through these middleware and we have required listing routes in listing variablw

app.use('/listing/:id/reviews',review)

app.get('/demo',async (req,res)=>{
    let firstuser= new user({
        userName:"sachin",
        email:"sachinjaing494@gmail.com",

    })
    let reguser=await User.register(firstuser,"helloworld");
    res.send(reguser)
})

app.get('/user/signup', (req, res) => {
    res.render("signup.ejs");
});

app.all("*",(req,res,next)=>{
    next(new ErrorClass(404,"Page not Found"));
})
  app.use((err,req,res,next)=>{
  let statuscode= err.statuscode?err.statuscode:500;
  let message=err.message?err.message:err;
  res.render("error.ejs",{message});
  })


app.listen(port, (err) => {
    if (err) throw err;
    console.log("server is listening");
})
