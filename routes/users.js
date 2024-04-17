const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const User = require("../models/user.js");
const passport = require("passport");
const { saveRedirectUrl } = require("../middleware.js");
const userController = require("../controllers/users.js");

//SIGNUP GET
router.get("/signup",userController.renderSignupForm);

//REGISTER USER
router.post("/signup", wrapAsync(userController.signup));

//LOGIN PAGE
router.get("/login", userController.renderLoginForm);

//POST REQUEST        authenticate user using passport.authenticate function as a middleware
router.post("/login", saveRedirectUrl,
    passport.authenticate("local", {failureRedirect:"/login", failureFlash:true})
    ,wrapAsync(userController.login));

//LOGOUT USER
router.get("/logout",userController.logout);




module.exports = router;