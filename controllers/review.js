const Listing=require("../models/listing.js");
const review=require("../models/review.js");

module.exports.reviewPost=async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new review(req.body.review);
    newReview.author=req.user._id;
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("Success","New Review Created");
    res.redirect(`/listings/${req.params.id}`);
};

module.exports.reviewDelete=async(req,res)=>{
    let{id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("Deleted","Review Deleted!");
    res.redirect(`/listings/${id}`);
};