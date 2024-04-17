const express = require("express");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");
const User= require("../models/user.js");

module.exports.signup = async(req,res)=>{
    try{
        let {username, email, password} = req.body;
        let newUser = new User({username, email});
        const registeredUser = await User.register(newUser,password);
        console.log(registeredUser);
        req.login(registeredUser,(err)=>{
        if(err) return next(err);
        req.flash("success","User Registered Successfully");
        res.redirect("/listings");
    })}catch(err){
        req.flash("error",err.message);
        res.redirect("/signup");
    }
    
}

module.exports.renderSignupForm = (req,res)=>{
    res.render("users/signup.ejs");
}

module.exports.renderLoginForm = (req,res)=>{
    res.render("users/login.ejs")
}

module.exports.login = async (req,res)=>{
    req.flash("success","welcome back to WanderLust!");
    let redirectUrl = res.locals.redirectUrl || "/listings"
    res.redirect(redirectUrl);
}

module.exports.logout = (req,res,next)=>{
    req.logout((err)=>{
        if(err) return next(err);
        req.flash("success","You are logged out succesfully")
        res.redirect("/listings");
    })
}