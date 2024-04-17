const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing} = require("../middleware.js");
const {isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js")

//listing validation middleware function


//INDEX ROUTE
router.get("/",wrapAsync(listingController.index));

//NEW ROUTE
router.get("/new",isLoggedIn,listingController.renderNewForm);

//CREATE ROUTE
router.post("/", isLoggedIn, validateListing ,wrapAsync(listingController.createListing))


//SHOW ROUTE
router.get("/:id",wrapAsync(listingController.showListings));

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm));

//UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(listingController.updateListing));

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(listingController.destroyListing));

module.exports = router;