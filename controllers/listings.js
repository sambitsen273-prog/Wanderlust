const Listing=require("../models/listing.js");
const fetch = require("node-fetch");  // make sure installed
const { cloudinary } = require("../cloudconfig"); // adjust path if needed

async function getCoordinates(location) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${location}`
  );

  const data = await response.json();

  if (!data.length) return null;

  return {
    type: "Point",
    coordinates: [
      parseFloat(data[0].lon),
      parseFloat(data[0].lat)
    ]
  };
}

module.exports.index = async (req, res) => {
  const { category, search } = req.query;

  let filter = {};

  // 🔍 Search filter (country, location, category)
  if (search && search.trim() !== "") {
    filter.$or = [
      { country: { $regex: search, $options: "i" } },
      { location: { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } }
    ];
  }

  // 🏷 Category filter
  if (category) {
    filter.category = category;
  }

  const allListings = await Listing.find(filter);

  res.render("listings/index", { 
    allListings, 
    category, 
    search 
  });
};

module.exports.newRoute=async(req,res)=>{
    res.render("listings/new.ejs");
};

module.exports.showRoute=async(req,res)=>{
    let {id}=req.params;
    const Listings= await Listing.findById(id).populate({path:"reviews",populate:{path:"author"}}).populate("Owner");
    if(!Listings){
        req.flash("error","The Listing you are trying to reach doesn't exist");
        res.redirect("/");
    }else{
        res.render("listings/show.ejs",{Listings});
    }
};

module.exports.createRoute = async (req, res) => {
  try {
    // ✅ Normalize category
    if (!req.body.listing.category) {
      req.body.listing.category = [];
    }

    if (!Array.isArray(req.body.listing.category)) {
      req.body.listing.category = [req.body.listing.category];
    }

    const location = req.body.listing.location;

    // 🌍 Get coordinates
    const geometry = await getCoordinates(location);

    if (!geometry) {
      req.flash("error", "Invalid Location");
      return res.redirect("/listings/new");
    }

    const newListing = new Listing({
      ...req.body.listing,
      Owner: req.user._id,
      image: {
        url: req.file.secure_url,
        filename: req.file.public_id
      },
      geometry
    });

    await newListing.save();
    req.flash("success", "New Listing Created");
    res.redirect(`/listings/${newListing._id}`);

  } catch (err) {
    console.log(err);
    req.flash("error", err.message);
    res.redirect("/listings/new");
  }
};

module.exports.editRoute=async(req,res)=>{
    let {id}=req.params;
    let listing=await Listing.findById(id);
    res.set("Cache-Control", "no-store");
    if(!listing){
        req.flash("error","The Listing you are trying to reach doesn't exist");
        res.redirect("/");
    }else{
        let originalImage=listing.image.url;
        originalImage=originalImage.replace("/upload","/upload/w_250");
        res.render("listings/edit.ejs",{listing,originalImage});
    }
};

module.exports.updateRoute=async(req,res)=>{
  if (!req.body.listing.category) {
    req.body.listing.category = [];
  }

  if (!Array.isArray(req.body.listing.category)) {
    req.body.listing.category = [req.body.listing.category];
  }
  let {id}=req.params;
  let listing=req.body.listing;
  const existingListing = await Listing.findById(id);

  // 🔥 Only update coordinates if location changed
  if (existingListing.location !== listing.location) {
    const geometry = await getCoordinates(listing.location);

    if (!geometry) {
      req.flash("error", "Invalid location");
      return res.redirect(`/listings/${id}`);
    }

    listing.geometry = geometry;
  }
  let UpdatedListing=await Listing.findByIdAndUpdate(id,listing,{runValidators:true, returnDocument: "after"});
  if(typeof req.file !=="undefined"){
      let url=req.file.secure_url;
      let filename=req.file.public_id;
      UpdatedListing.image={url,filename};
      await UpdatedListing.save();
  }
  req.flash("Success","Listing Updated");
  res.redirect(`/listings/${id}`);
};

module.exports.deleteRoute = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find the listing first
    const listing = await Listing.findById(id);
    if (!listing) {
      req.flash("error", "Listing not found");
      return res.redirect("/listings");
    }

    // Delete image from Cloudinary
    if (listing.image && listing.image.filename) {
      await cloudinary.uploader.destroy(listing.image.filename);
    }

    // Delete the listing from database
    await Listing.findByIdAndDelete(id);

    req.flash("Success", "Listing deleted successfully");
    res.redirect("/listings");

  } catch (err) {
    console.log(err);
    req.flash("error", "Something went wrong");
    res.redirect("/listings");
  }
};