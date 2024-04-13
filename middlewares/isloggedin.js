const Listing = require("../models/listingmodel");
const reviews = require("../models/reviewmodel");
const{ListingSchema}  = require('../schema');
// function isloggedin(req,res,next){
//     //console.log(req.user);
//     if(!req.isAuthenticated()){
//        req.session.redirectUrl=req.originalUrl;
//         console.log( req.session.redirectUrl)
       
//         req.flash("fail","you must be loged in to do these")
//          res.redirect("/user/login")
        
//     }else{
//         console.log(`the reques yser id is ${req.user._id}`);
//         console.log(res.locals.user)
//     }
//     next();

// }
module.exports. validateListing = (req, res, next) => {
    let { error } = ListingSchema.validate(req.body);
    if (error) {
        let errMsg = error.details.map(el => el.message).join(",");
        next(new ErrorClass(400, errMsg));
    } else {
        next();
    }
}
module.exports.isloggedin = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log( req.session.redirectUrl)
        req.flash("fail","you must be loged in to do these")
        return res.redirect("/user/login");
    }else{
        console.log(`the reques yser id is ${req.user._id}`);
    }
    next();
}

module.exports. savedRedirectUrl=(req, res, next)=> {
    if (req.session.redirectUrl) {
        res.locals.redirectUrl = req.session.redirectUrl;
        console.log(res.locals.redirectUrl);
    }
    next(); 
}

module.exports.isAuthorized=  async (req,res,next)=>{
    let id= req.params.id;
        let listing = await Listing.findById(id);
        if(!listing.owner._id.equals(res.locals.user._id)){
           
            req.flash("fail","you are not owner of listing to make changes");
           return res.redirect(`/listing/details/${id}`);


        }
        next()

}
module.exports.isReviewOwner=  async (req,res,next)=>{
    let reviewid= req.params.reviewid
    let id= req.params.id;
        let review = await reviews.findById(reviewid);
        if(!review.author.equals(res.locals.user._id)){
           
            req.flash("fail","you are not owner of review to delete it");
           return res.redirect(`/listing/details/${id}`);


        }
        next()

    }

    

