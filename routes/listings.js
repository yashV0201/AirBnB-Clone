const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js")

//listing validation middleware function

router.route("/")
    .get(wrapAsync(listingController.index))
    .post( isLoggedIn, validateListing ,wrapAsync(listingController.createListing));


//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);


router.route("/:id")
    .get(wrapAsync(listingController.showListings))
    .put(isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing))
    .delete(isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));


//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));




module.exports = router;