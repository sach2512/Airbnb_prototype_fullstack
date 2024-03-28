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

app.get('/listing', wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    //console.log(listings);
    res.render("index.ejs", { listings });
}))

app.get('/listing/details/:id', wrapAsync(async (req, res) => {
    let id = req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id);
    res.render("show.ejs", { listing });

}))


 app.get('/listing/new', wrapAsync(async (req, res) => {
    await res.render("newlisting.ejs");
}))

app.post('/newlisting', wrapAsync(async (req, res,next) => {
    if(!req.body.Listing){
        throw new ErrorClass(404,"bad request")
    }
    
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

app.put('/listing/:id/edited', wrapAsync(async (req, res) => {
    
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

app.post('listing/:id/review', async (req,res)=>{
   console.log("hello")
   
})
  

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
