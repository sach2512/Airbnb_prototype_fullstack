const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

const port = 8080;
const app = express();
const methodOverride = require("method-override");
const data = require('./data/data');

app.set("view engine", "ejs");
const path= require("path");
//app.set("views", "./views/listings");

app.use(express.static('./public'));
app.set("views", path.join(__dirname,"views/listings"));
app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const engine = require("ejs-mate");
app.engine('ejs', engine);

const ErrorClass= require('./utils/errorclass')

const listingrouter= require('./routes/listing');
const reviewrouter= require('./routes/review');
const userrouter= require('./routes/user')
const session= require("express-session");
const MongoStore = require('connect-mongo');
const flash= require("connect-flash");
const passport= require("passport");
const User= require('./models/user.js')
const LocalStrategy = require('passport-local');
const {savedRedirectUrl} = require('./middlewares/isloggedin.js');
const Url=process.env.atlas_url
main()
    .then(() => {
        console.log("Connection Successfull");
    })
    .catch(err => console.log(err));

async function main() {
    await mongoose.connect(Url);
}

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash())
const store=MongoStore.create({
    mongoUrl:Url,
    crypto:{
        secret:process.env.SECRET,
        
    },
    touchAfter:24*3600,
})
store.on("error",()=>{
    console.log(err);
})
const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now()+15*24*60*60*1000,//// Expires after 21 days
        maxAge:21*24*60*60*1000, //// Expires after 21 days of inactivity
        httpOnly:true,


    }
};


app.use(session(sessionOptions));
app.use((req,res,next)=>{
    res.locals.success= req.flash("success");
    res.locals.fail= req.flash("fail");
 res.locals.user=req.user
    
    next()
})


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());




app.use((req, res, next) => {
    //console.log('req.user:', req.user); // Log req.user
    res.locals.user = req.user; // Set res.locals.user
    console.log('req.user:', req.user);
    next();
});


app.use('/user',userrouter);

app.use('/listing',listingrouter);

app.use('/listing/:id/reviews',reviewrouter)


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
