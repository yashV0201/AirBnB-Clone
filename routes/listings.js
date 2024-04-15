const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const {listingSchema,reviewSchema} = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const {isLoggedIn} = require("../middleware.js");

//listing validation middleware function
const validateListing = (req,res,next)=>{
    let {error} = listingSchema.validate(req.body); //checking for schema validations and storing the error object
    if(error){   // if error exists then throw a custom error 
        let errMsg = error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400, errMsg);
    }else{      // if not then move on to next function
        next();
    }
}

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
    await newListing.save();
    req.flash("success","New Listing Created!");
    res.redirect("/listings");
    })
)


//SHOW ROUTE
router.get("/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    if(!listing){
        req.flash("error","Listing Not Found!");
        res.redirect("/listings");
    }
    res.render("listings/show.ejs",{listing});
    })
);

//EDIT ROUTE
router.get("/:id/edit",isLoggedIn,wrapAsync(async (req,res,next)=>{
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
router.put("/:id",isLoggedIn,validateListing,wrapAsync(async (req,res,next)=>{
    
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success","Listing Updated!");
    res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
router.delete("/:id",isLoggedIn, wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success","Listing Deleted!");
    res.redirect("/listings");
    })
);

module.exports = router;