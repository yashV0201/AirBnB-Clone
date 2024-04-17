const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {isLoggedIn, validateListing} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

//listing validation middleware function


//INDEX ROUTE
router.get("/",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    })
);

//NEW ROUTE
router.get("/new",isLoggedIn,(req,res)=>{
    res.render("listings/new.ejs");
});

//CREATE ROUTE
router.post("/", isLoggedIn, validateListing ,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    })
)


//SHOW ROUTE
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews").populate("owner");
    if(!listing){
        req.flash("error","Listing Not Found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    })
);

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,isOwner,wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    if(!listing){
        req.flash("error","Listing Not Found!");
        res.redirect("/listings");
    }
    res.render("listings/edit.ejs",{listing});
    })
);

//UPDATE ROUTE
router.put("/:id",isLoggedIn,isOwner,validateListing,wrapAsync(async (req,res,next)=>{
    
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    })
);

module.exports = router;