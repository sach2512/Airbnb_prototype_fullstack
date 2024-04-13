const reviews = require("../models/reviewmodel");
const Listing = require("../models/listingmodel");

module.exports.newreview= async (req, res) => {
    const { rate, review } = req.body;
    const listing = await Listing.findById(req.params.id);
    const newReview = new reviews({
        rating: rate,
        review: review
    });
    newReview.author= req.user._id;
    await newReview.save();
    listing.review.push(newReview);
    await listing.save();
    //console.log(listing)
    console.log(newReview);
   req.flash("success","review added successfully")
    res.redirect(`/listing/details/${req.params.id}`);
   
 
   

}


module.exports.deletereview= async(req,res)=>{
        
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
}