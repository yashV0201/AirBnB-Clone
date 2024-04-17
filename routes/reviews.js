const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {isLoggedIn,validateReview} = require("../middleware.js");

//review validation middleware function


//POST Review ROUTE
router.post("/",validateReview, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);       

    await newReview.save();
    await listing.save();
    req.flash("success","New Review Created!");
    console.log("new review saved");
    res.redirect(`/listings/${id}`);
    })
)

//DELETE review Route

router.delete("/:reviewId", wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted!");
    res.redirect(`/listings/${id}`);
}))


module.exports = router;