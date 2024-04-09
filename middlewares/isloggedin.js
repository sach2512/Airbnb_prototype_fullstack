
function isloggedin(req,res,next){

    if(!req.isAuthenticated()==true){
        req.session.redirectUrl=req.originalUrl;
        console.log( req.session.redirectUrl)
        req.flash("fail","you must be loged in to do these")
         res.redirect("/user/login")
    
    }
    next();

}

module.exports.savedRedirectUrl=(req,res,next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl=req.session.redirectUrl;
        console.log(res.locals.redirectUrl)
    }
    next(); 
}
module.exports=isloggedin;