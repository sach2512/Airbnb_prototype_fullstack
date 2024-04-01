const express = require("express");
const mongoose = require("mongoose");
//const reviews = require('./models/reviewmodel')
const port = 8080;
const app = express();
const methodOverride = require("method-override");
const data = require('./data/data');
//const Listing = require("./models/listingmodel");
app.set("view engine", "ejs");
const path= require("path");
app.set("views", "./views/listings");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const engine = require("ejs-mate");
app.engine('ejs', engine);
//const wrapAsync= require('./utils/wrapAsync')
const ErrorClass= require('./utils/errorclass')
//const{ListingSchema,ReviewSchema}  = require('./schema');
//const { log } = require("console");
const listing= require('./routes/listing');
const review= require('./routes/review');

app.use(express.json());

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

app.use('/listing',listing);//here meaning is konsi bhi requiest /listing kaan aiye tho it will pass through these middleware and we have required listing routes in listing variablw

app.use('/listing/:id/reviews',review)



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
