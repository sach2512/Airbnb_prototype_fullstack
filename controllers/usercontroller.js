const User = require("../models/user");
module.exports.signupform=(req,res)=>{
    res.render("signup.ejs")
}


module.exports.loginform=(req,res)=>{
    res.render("login.ejs");
}
module.exports.signup=async (req, res) => {
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
}


module.exports.login=async (req, res) => {
    req.flash("success","you are logged in")
    console.log(`the reques yser id is ${req.user._id}`);
    let redirectUrl= res.locals.redirectUrl||'/listing'
    //console.log(res.locals.redirectUrl)
    //res.redirect(res.locals.redirectUrl);
    //res.redirect('/listing');
   res.redirect(redirectUrl);
    //console.log(`the redirect url is : ${redirectUrl}`);
 }



module.exports.logout=(req,res,next)=>{
    req.logout((err)=>{
       if(err){
        next(err)
       }else{
        req.flash("success","you are loged out!");
        res.redirect('/listing');
       }
    })
 }