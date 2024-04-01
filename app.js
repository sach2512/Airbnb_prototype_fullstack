const express = require("express");
const mongoose = require("mongoose");
const reviews = require('./models/reviewmodel')
const port = 8080;
const app = express();
const methodOverride = require("method-override");
const data = require('./data/data');
const Listing = require("./models/listingmodel");
app.set("view engine", "ejs");
const path= require("path");
app.set("views", "./views/listings");
app.use(express.static('./public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
const engine = require("ejs-mate");
app.engine('ejs', engine);
const wrapAsync= require('./utils/wrapAsync')
const ErrorClass= require('./utils/errorclass')
const{ListingSchema,ReviewSchema}  = require('./schema');
const { log } = require("console");

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

const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        next(new ErrorClass(400, errMsg));
    } else {
        next();
    }
}

const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        next(new ErrorClass(400, errMsg));
    } else {
        next();
    }
}

app.get('/',async(req,res)=>{
    res.send("hi i am home");
})

app.get('/listing', wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    //console.log(listings);
    res.render("index.ejs", { listings });
}))

app.get('/listing/details/:id', wrapAsync(async (req, res) => {
    let id = req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id).populate("review");
    res.render("show.ejs", { listing });

}))


 app.get('/listing/new', wrapAsync(async (req, res) => {
    await res.render("newlisting.ejs");
}))

app.post('/newlisting', validateListing, wrapAsync(async (req, res,next) => {
   
   
   console.log(result)
        let { title, description, image, price, location, country } = req.body;

        const newlist = new Listing({
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        });
        await newlist.save();
        res.redirect('/listing');
   
    
}));





app.get('/listing/:id/edit', wrapAsync(
    async (req, res) => {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        res.render("edit.ejs", { listing });
        console.log(listing);
    }
))

app.put('/listing/:id/edited', validateListing, wrapAsync(async (req, res) => {
    
        let id = req.params.id;
        let { title, description, image, price, location, country } = req.body;
        
        await Listing.findByIdAndUpdate(id, {
            title: title,
            description: description,
            image: image,
            price: price,
            location: location,
            country: country
        });
        
        res.redirect(`/listing/details/${id}`);
     
       
    
}));

  app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  }));


  app.post("/listing/:id/reviews",  wrapAsync(async (req, res) => {
    const { rate, review } = req.body;
    const listing = await Listing.findById(req.params.id);
    const newReview = new reviews({
        rating: rate,
        review: review
    });
    await newReview.save();
    listing.review.push(newReview);
    await listing.save();
    console.log(listing);
    res.redirect(`/listing/details/${req.params.id}`);
   
 
   

}));

app.delete('/listing/:id/review/:reviewid',wrapAsync(async(req,res)=>{
        
       let id= req.params.id;
       let reviewid = req.params.reviewid;

       
       await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewid } });

       await reviews.findByIdAndDelete(reviewid);
       res.redirect(`/listing/details/${req.params.id}`);
}))


  

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
