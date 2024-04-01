const express= require("express");
const router= express.Router();
const methodOverride = require("method-override");
const Listing = require("../models/listingmodel");
const{ListingSchema}  = require('../schema');
const wrapAsync= require('../utils/wrapAsync')
const ErrorClass= require('../utils/errorclass')

const validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        next(new ErrorClass(400, errMsg));
    } else {
        next();
    }
}

router.get('/', wrapAsync(async (req, res) => {
    const listings = await Listing.find();
    //console.log(listings);
    res.render("index.ejs", { listings });
}))

router.get('/details/:id', wrapAsync(async (req, res) => {
    let id = req.params.id;
    //console.log(id);
    const listing = await Listing.findById(id).populate("review");
    res.render("show.ejs", { listing });

}))

//create route

router.get('/new', wrapAsync(async (req, res) => {
    await res.render("newlisting.ejs");
}))

router.post('/newlisting',  wrapAsync(async (req, res,next) => {
   
   
   
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

//edit route
router.get('/:id/edit', wrapAsync(
    async (req, res) => {
        let id = req.params.id;
        let listing = await Listing.findById(id);
        res.render("edit.ejs", { listing });
        console.log(listing);
    }
))

router.put('/:id/edited', validateListing, wrapAsync(async (req, res) => {
    
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

//delete route

router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    let deletedListing = await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    res.redirect("/listing");
  }));


  module.exports=router;