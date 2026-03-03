const express=require("express");
const Router=express.Router({mergeParams:true});
const wrapAsync = require("../utilis/wrapAsync");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware");
const UserController=require("../controllers/User.js")

Router.route("/signup")
//Get Route for User in signup
.get(UserController.renderSignupForm)
//Post Route for User in signup
.post(wrapAsync(UserController.signupPost));

Router.route("/login")
//Get Route for User in login
.get(UserController.loginForm)
//Post Route for User in login
.post(saveRedirectUrl,passport.authenticate("local",{failureRedirect:"/Users/login",failureFlash: true}), UserController.loginPost);

Router.get("/logout",UserController.logout);

module.exports=Router;
