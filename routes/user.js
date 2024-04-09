const express= require("express");
const router= express.Router();
const User = require("../models/user");
const passport= require("passport");


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

        
        await User.register(user, password);

        req.flash("success", "Signup successful");
        res.redirect('/listing');
    } catch (error) {
       
        console.log(error);
        req.flash("error", "Signup failed");
        res.redirect('/signup'); 
    }
});


router.get('/login',(req,res)=>{
    res.render("login.ejs");
})

router.post('/login', passport.authenticate("local", { failureRedirect: '/user/login', failureflash: true }), async (req, res) => {
    req.flash("success","you are logged in")
    res.redirect('/listing');
 })

 module.exports=router;