const express= require("express");
const router= express.Router();
const User = require("../models/user");
const passport= require("passport");
const {savedRedirectUrl} = require('../middlewares/isloggedin');


router.get('/signup',(req,res)=>{
    res.render("signup.ejs")
})

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

       
        const user = new User({
            email: email,
            username: username,
           password: password
        });

        
       const registeredUser= await User.register(user, password);
       req.login(registeredUser,(err)=>{
        if(err){
           return next(err)
        }else{
            req.flash("success", "Signup successful ,you are logged in");
            res.redirect('/listing');
        }
       })

       
    } catch (error) {
       
        console.log(error);
        req.flash("error", "Signup failed");
        res.redirect('/signup'); 
    }
});


router.get('/login',(req,res)=>{
    res.render("login.ejs");
})

router.post('/login', savedRedirectUrl,

passport.authenticate("local", { failureRedirect: '/user/login', failflash: true }), async (req, res) => {
    req.flash("success","you are logged in")
    console.log(`the reques yser id is ${req.user._id}`);
    let redirectUrl= res.locals.redirectUrl||'/listing'
    //console.log(res.locals.redirectUrl)
    //res.redirect(res.locals.redirectUrl);
    //res.redirect('/listing');
   res.redirect(redirectUrl);
    //console.log(`the redirect url is : ${redirectUrl}`);
 })

 module.exports=router;