const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const ExpressError = require("../utils/ExpressError.js");
const Review = require("../models/review.js");
const {isLoggedIn,validateReview,isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");
const { destroyReview } = require("../controllers/reviews.js");


//review validation middleware function


//POST Review ROUTE
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

//DELETE review Route

router.delete("/:reviewId",isLoggedIn,isReviewAuthor, wrapAsync(reviewController.destroyReview))


module.exports = router;