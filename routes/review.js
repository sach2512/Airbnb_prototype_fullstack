const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require('../utils/wrapAsync')
const ErrorClass= require('../utils/errorclass')
const{ReviewSchema}  = require('../schema');

const reviews = require('../models/reviewmodel')
const methodOverride = require("method-override");
const Listing = require("../models/listingmodel");

const validateReview = (req, res, next) => {
    let { error } = ReviewSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        next(new ErrorClass(400, errMsg));
    } else {
        next();
    }
}
// new reviews


router.post("/",  wrapAsync(async (req, res) => {
    const { rate, review } = req.body;
    const listing = await Listing.findById(req.params.id);
    const newReview = new reviews({
        rating: rate,
        review: review
    });
    await newReview.save();
    listing.review.push(newReview);
    await listing.save();
    console.log(listing)
    console.log(newReview);
   req.flash("success","review added successfully")
    res.redirect(`/listing/details/${req.params.id}`);
   
 
   

}));
// delete  review and one to one relation
router.delete('/:reviewid',wrapAsync(async(req,res)=>{
        
    let id= req.params.id;
    let reviewid = req.params.reviewid;
   
   
     req.flash("success","review  deleted successfully")
    await reviews.findByIdAndDelete(reviewid);
   
    res.redirect(`/listing/details/${req.params.id}`);
    listingSchema.post("findOneAndDelete",
    async (listing) => {
   if(listing){
       await reviews.deleteMany({ _id: { $in: listing.reviews } });
   }});
}))

module.exports=router;