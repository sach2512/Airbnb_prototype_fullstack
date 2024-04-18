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
        console.log(`the final user is ${req.user}`)
        if(err){
           return next(err)
        }else{
            req.flash("success", "Signup successful ,you are logged in");
            res.redirect('/listing');
        }
       })

       
    } catch (error) {
       
        console.log(error);
        req.flash("fail", "Signup failed");
        res.redirect('/signup'); 
    }
}


module.exports.login = async (req, res) => {
   
    if (req.user) {
        req.flash("success", "You are logged in");
        console.log(`The request user id is ${req.user._id}`);
        let redirectUrl = res.locals.redirectUrl || '/listing';
        return res.redirect(redirectUrl);
    } else {
        
        req.flash("fail", 'Authentication failed. Please check your credentials.');
        return res.redirect('/user/login');
    }
};




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