if(process.env.NOSE_ENV != "production"){
    require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const listings= require("./routes/listings.js")
const reviews = require("./routes/reviews.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require('passport');
const LocalStrategy = require("passport-local");
const User = require("./models/user.js")
const users =require("./routes/users.js");
const multer = require("multer");
const {storage , cloudinary} = require("./cloudConfig.js");
const upload = multer({storage});

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine("ejs",ejsMate);
app.use(express.static(path.join(__dirname,"public")));



const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust"
const dbUrl = process.env.ATLASDB_URL;

main().then(()=>{
    console.log("Connected to DB");
}).catch(err=>{
    console.log(err);
})

async function main(){
    await mongoose.connect(dbUrl);
}



const store = MongoStore.create({
    mongoUrl:dbUrl,
    crypto:{
        secret:"mySecret"
    },
    touchAfter: 24*3600
});

store.on("error", ()=>{
    console.log("ERROR IN SESSION STORE",err);
})

const sessionOptions = {
    store,
    secret:"mySecret",
    resave:false,
    saveUninitialized: true,
    cookie:{
        expires: Date.now() + 7*24*60*60*1000,
        maxAge: 7*24*60*60*1000,
        httpOnly:true
    }
};



app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
})

//LISTINGS
app.use("/listings",listings);

//REVIEWS
app.use("/listings/:id/reviews",reviews);

//Users
app.use("/",users);

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