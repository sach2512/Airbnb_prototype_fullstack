const express= require("express");
const router= express.Router();
const methodOverride = require("method-override");
const Listing = require("../models/listingmodel");
const{ListingSchema}  = require('../schema');
const wrapAsync= require('../utils/wrapAsync')
const ErrorClass= require('../utils/errorclass');
const {isloggedin,isAuthorized,validateListing}= require("../middlewares/isloggedin");
const listingcontroller= require('../controllers/listingcontroller.js')
const multer  = require('multer')
const {storage} = require('../cloudConfig.js');
const {cloudinary}= require('../cloudConfig.js');
const upload = multer({ storage });


// show route
router.get('/', wrapAsync(listingcontroller.index));

router.get('/details/:id',(listingcontroller.showlisting) )

//create route

router.get('/new', isloggedin, wrapAsync(listingcontroller.addlisting))

//router.post('/newlisting',upload.single("image"), wrapAsync(listingcontroller.newlisting));
router.post('/newlisting', upload.single("image"),async(req,res)=>{
  res.send(req.file);
})

//edit route
router.get('/:id/edit', isloggedin, isAuthorized, wrapAsync(listingcontroller.edit));

router.put('/:id/edited', isloggedin,isAuthorized,   wrapAsync(listingcontroller.edited));

//delete route

router.delete("/:id", isloggedin,isAuthorized,  wrapAsync(listingcontroller.delete));

module.exports=router;