const User=require("../models/user");

module.exports.renderSignupForm=(req,res)=>{
    res.render("Users/signup.ejs");
};

module.exports.signupPost=async(req,res)=>{
    try{
        let {username,email,password}=req.body;
        const newUser=new User({email,username});
        const registeredUser=await User.register(newUser,password);
        
        req.login(registeredUser,(err)=>{
            if(err){
                return next(err);
            }
            req.flash("Success","Welcome to Wanderland");
            res.redirect("/listings");
        });

    }catch(e){
        req.flash("error",e.message);
        res.redirect("/Users/signup");
    }
};

module.exports.loginForm=(req,res)=>{
    res.render("Users/login.ejs");
};

module.exports.loginPost=async(req,res)=>{
    req.flash("Success","Welcome to Wanderlust: You are Logged In");
    if(res.locals.redirectUrl){
        res.redirect(res.locals.redirectUrl);
    }
    else{
        res.redirect("/listings");
    }
};

module.exports.logout=(req,res)=>{
    req.logOut((err)=>{
        if(err){
            return next(err);
        }
        req.flash("Success","You are logged Out.");
        res.redirect("/listings");
    });
};