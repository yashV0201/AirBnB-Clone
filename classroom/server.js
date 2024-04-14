const express = require('express');
const app = express();
const session = require('express-session');
const flash = require("connect-flash");
const path = require("path");


const sessionInfo = {
    secret:"mysecret",
    resave:false, 
    saveUninitialized:true
}

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(session(sessionInfo));
app.use(flash());

app.use((req,res,next)=>{
    res.locals.successMsg = req.flash("success");
    res.locals.failureMsg = req.flash("failed");
    next();
})

app.get("/register",(req,res)=>{
    let {name = "anonymous"} = req.query;
    // key, message pair
    req.session.name = name;      // req.session stores info related to current session, creating a name variable in the object and giving it vaue name
    if(name === "anonymous"){
        req.flash("failed","user not registered"); 
    }
    else  req.flash("success","user registered successfully");
   
    res.redirect("/hello")
})

//give a name in the query string eg. localhost:3000/register?name=yash
//now open hello ie. localhost:3000/hello...surprise!

app.get("/hello",(req,res)=>{
    
    res.render("page.ejs",{name:req.session.name});
})


// app.get("/test", (req,res)=>{
//     res.send("test successful!")
// })


app.listen(3000,()=>{
    console.log("server is listening to 3000");
})