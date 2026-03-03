const express=require("express");
const Router=express.Router({mergeParams:true});
const wrapAsync=require("../utilis/wrapAsync.js");
const {validateReview,isLoggedIn, isReviewAuthor}=require("../middleware.js");
const ReviewController=require("../controllers/review.js");

//Review Post Route
Router.post("/",isLoggedIn,validateReview,wrapAsync(ReviewController.reviewPost));

//Delete Review Route
Router.delete("/:reviewId",isLoggedIn,isReviewAuthor,wrapAsync(ReviewController.reviewDelete));

module.exports=Router;