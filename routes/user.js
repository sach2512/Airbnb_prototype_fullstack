const express= require("express");
const router= express.Router();
const User = require("../models/user");
const passport= require("passport");
const wrapAsync= require('../utils/wrapAsync')
const ErrorClass= require('../utils/errorclass')
const {savedRedirectUrl} = require('../middlewares/isloggedin');
const usercontroller= require('../controllers/usercontroller.js')

router.get('/signup',usercontroller.signupform)

router.post('/signup', wrapAsync(usercontroller.signup));


router.get('/login',usercontroller.loginform)

router.post('/login', savedRedirectUrl,

passport.authenticate("local", { failureRedirect: '/user/login', failflash: true }), usercontroller.login)
 
 router.get('/logout',usercontroller.logout)
 module.exports=router;