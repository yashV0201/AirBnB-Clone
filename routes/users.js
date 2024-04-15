const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");

//SIGNUP GET
router.get("/signup",(req,res)=>{
    res.render("users/signup.ejs");
})

//REGISTER USER
router.post("/signup", wrapAsync(async(req,res)=>{
    try{
        let {username, email, password} = req.body;
    let newUser = new User({username, email});
    const registeredUser = await User.register(newUser,password);
    console.log(registeredUser);
    req.flash("success","User Registered Successfully");
    res.redirect("/listings");
    }catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}))

//LOGIN PAGE
router.get("/login", (req,res)=>{
    res.render("users/login.ejs")
})

//POST REQUEST        authenticate user using passport.authenticate function as a middleware
router.post("/login", 
    passport.authenticate("local", {failureRedirect:"/login", failureFlash:true})
    ,wrapAsync(async (req,res)=>{
        req.flash("success","welcome back to WanderLust!");
        res.redirect("/listings");
}))

//LOGOUT USER
router.get("/logout",(req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You are logged out succesfully")
        res.redirect("/listings");
    })
})




module.exports = router;