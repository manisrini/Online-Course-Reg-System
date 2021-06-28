const express 		= require("express");
const app 			= express();
const mongoose  	= require("mongoose");
const passport  	= require("passport");
const LocalStrategy = require("passport-local");
var bodyParser		= require("body-parser");
const bcrypt 		= require("bcryptjs");
const session 		= require("express-session");
const checkAuth		= require("./middleware/middleware.js");
const flash 		= require("connect-flash"); 

//routes
const courseRoutes = require("./routes/course.js")
const authRoutes = require("./routes/auth.js")
require("./config/passportconf.js")(passport)

app.set("view engine","ejs");

app.use(bodyParser.urlencoded({extended:true}))




mongoose.connect(process.env.DBURL,{
	useNewUrlParser: true,
  	useUnifiedTopology: true
})
.then( () => {
	console.log("Connected to db :)")
})
.catch(error => {
	console.log("Error in db!")
})

app.use(session({
	secret : "mani",
	resave : true,
	saveUninitialized : true
}))

app.use(passport.initialize())
app.use(passport.session())
app.use(flash());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	res.locals.successmsg = req.flash("success");
	res.locals.errormsg = req.flash("error_msg");
	res.locals.error   = req.flash("error");
	next();
})
app.use(authRoutes);
app.use(courseRoutes);



app.get("/",function(req,res){
	res.render("index.ejs")
})




app.listen(process.env.PORT||3000,process.env.IP,function(){
	console.log("Server started!!!");
})