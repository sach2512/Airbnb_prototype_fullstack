const express= require("express");
const router= express.Router({mergeParams:true});
const wrapAsync= require('../utils/wrapAsync')
const ErrorClass= require('../utils/errorclass')
const{ReviewSchema}  = require('../schema');

const reviews = require('../models/reviewmodel')
const methodOverride = require("method-override");
const Listing = require("../models/listingmodel");
const { isloggedin,isReviewOwner,validateReview } = require("../middlewares/isloggedin");
const reviewcontroller= require('../controllers/reviewcontroller.js');





router.post("/", isloggedin,  wrapAsync( reviewcontroller.newreview));

router.delete('/:reviewid',isloggedin,isReviewOwner,wrapAsync(reviewcontroller.deletereview));

module.exports=router;