const express=require("express");
const Router=express.Router();
const wrapAsync=require("../utilis/wrapAsync.js");
const {isLoggedIn, isOwner, validateListing}=require("../middleware.js");
const ListingController=require("../controllers/listings.js")
const multer=require("multer");
const {storage}=require("../cloudconfig.js")
const upload=multer({storage});
const Listing=require("../models/listing.js");


Router.route("/")
//Index Route
.get(wrapAsync(ListingController.index))
//Create Route
.post(isLoggedIn,upload.single("listing[image]"),validateListing,wrapAsync(ListingController.createRoute));

//New Route
Router.get("/new",isLoggedIn,wrapAsync(ListingController.newRoute));

Router.route("/:id")
//Show Route
.get(wrapAsync(ListingController.showRoute))
//Update Route
.put(isLoggedIn,upload.single("listing[image]"),isOwner,validateListing,wrapAsync(ListingController.updateRoute))
//Delete Route
.delete(isLoggedIn,isOwner,wrapAsync(ListingController.deleteRoute));

//Edit Route
Router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(ListingController.editRoute));

module.exports=Router;