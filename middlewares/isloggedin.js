
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
module.exports.isloggedin = (req,res,next)=>{

    if(!req.isAuthenticated()){
        req.session.redirectUrl=req.originalUrl;
        console.log( req.session.redirectUrl)
        req.flash("fail","you must be loged in to do these")
        return res.redirect("/user/login");
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
//module.exports=savedRedirectUrl;
//module.exports=isloggedin;
