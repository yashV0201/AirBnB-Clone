const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");

//review validation middleware function
const validateReview = (req,res,next)=>{
    let {error} = reviewSchema.validate(req.body); //checking for schema validations and storing the error object
    if(error){   // if error exists then throw a custom error 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{      // if not then move on to next function
        next();
    }
}

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