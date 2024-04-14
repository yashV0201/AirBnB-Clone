const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings= require("./routes/listings.js")
const reviews = require("./routes/reviews.js");


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


//LISTINGS
app.use("/listings",listings);

//REVIEWS
app.use("/listings/:id/reviews",reviews);


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