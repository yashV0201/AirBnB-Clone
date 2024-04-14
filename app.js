const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./models/listing.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const {listingSchema,reviewSchema} = require("./schema.js")
const Review = require("./models/review.js");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));


main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}

app.get("/",(req,res)=>{
    res.send("root working fine")
});


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



//INDEX ROUTE
app.get("/listings",wrapAsync(async (req,res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs",{allListings});
    })
);

//NEW ROUTE
app.get("/listings/new",(req,res)=>{
    res.render("listings/new.ejs");
});

//CREATE ROUTE
app.post("/listings", validateListing ,wrapAsync(async (req,res,next)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect("/listings");
    })
)


//SHOW ROUTE
app.get("/listings/:id",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs",{listing});
    })
);

//EDIT ROUTE
app.get("/listings/:id/edit",wrapAsync(async (req,res,next)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    res.render("listings/edit.ejs",{listing});
    })
);

//UPDATE ROUTE
app.put("/listings/:id",validateListing,wrapAsync(async (req,res,next)=>{
    
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    res.redirect(`/listings/${id}`);
    })
);

//DELETE ROUTE
app.delete("/listings/:id", wrapAsync(async (req,res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
    })
);

//REVIEWS
//POST Review ROUTE
app.post("/listings/:id/reviews",validateReview, wrapAsync(async (req, res)=>{
    let {id} = req.params;
    let listing = await Listing.findById(id);
    let newReview = new Review(req.body.review);
    listing.reviews.push(newReview);       

    await newReview.save();
    await listing.save();

    console.log("new review saved");
    res.redirect(`/listings/${id}`);
    })
)

//DELETE review Route

app.delete("/listings/:id/reviews/:reviewId", wrapAsync(async(req,res)=>{
    let{id,reviewId} = req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);

    res.redirect(`/listings/${id}`);
}))




// app.get("/testListing",async (req,res)=>{
//     let sampleListing = new Listing({
//         title:"My New Villa",
//         description:"BY the beach",
//         price: 1200,
//         location:"Goa",
//         country:"India"
//     })

//     await sampleListing.save();
//     console.log("sample was saved");
//     res.send("testting successful");
// })

/* Error Handling */
//page not found error
app.all("*",(req,res,next)=>{
    next(new ExpressError(404, "page not found!"));
});

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    let{status=500,message="something went wrong"} = err;
    res.status(status).render("error.ejs",{message});
})

app.listen(8080,()=>{
    console.log("server is listening to port 8080");
})