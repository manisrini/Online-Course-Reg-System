
const express = require("express");
const router = express.Router();
const User = require("../models/user_model.js")
const passport  	= require("passport");
const LocalStrategy = require("passport-local");
const bcrypt 		= require("bcryptjs");
//Auth login
router.get("/login",(req,res) => {
	res.render("./users/login")
})

router.post("/login",(req,res,next)=> {
	passport.authenticate('local',{
		successRedirect : "/courses",
		successFlash    : req.flash("success","Logged in successfully"),
		failureFlash : true,
		failureRedirect : "/login"
	
	})(req,res,next);
})
//signup
router.get("/register",function(req,res){
	res.render("./users/register")
})

router.post("/register",function(req,res){
	
	const {email,name,password} = req.body;
	User.findOne({email : email})
	.then(user => {
		//user exists
		if(user){
			console.log("user already exists");
			req.flash("error_msg","user already exists: :( Register again");
			res.redirect("/");
		}
		//newuser
		else{
			const newUser = new User({
				email : email,
				name  : name,
				password : password
			})	;
		//hash password
		bcrypt.genSalt(10 , (err,salt)=>
			bcrypt.hash(newUser.password , salt , (err,hash) => {
			if(err)
			{	console.log(err);
				res.redirect("/")
			}
			newUser.password = hash;
			newUser.save()
			.then(user => {
				req.flash("success","registered successfully")
				res.redirect("/login")})
			.catch(err=>console.log(err))
		}))
		}
	})
	
})


//logout
router.get("/logout",function(req,res){
	req.logout();
	req.flash("success","logged out successfully")
	res.redirect("/");
})

module.exports = router;