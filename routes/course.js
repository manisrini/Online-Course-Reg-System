const express = require("express");
const router = express.Router();
const Course = require("../models/course_model.js")
const User = require("../models/user_model.js")
const checkAuth = require("../middleware/middleware.js")

//find courses
router.get("/courses",function(req,res){
	Course.find({},function(err,foundCourses){
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		else{
			res.render("./courses/courses",{courses : foundCourses})
		}
	})
})

//show info about a course
router.get("/:id/course",checkAuth,function(req,res){
	Course.findById(req.params.id,function(err,foundCourse){
		if(err){
			console.log(err);
			res.redirect("back");
		}else{
			res.render("./courses/show_course",{foundCourse : foundCourse})
		}
	})
	

})

//show my courses
router.get("/:user_id/mycourses",checkAuth,function(req,res){
	User.findById(req.params.user_id).populate("courses").exec(function(err,mycourses){
		if(err){
			console.log(err)
		}
		else{
			
			res.render("./users/mycourses",{mycourses : mycourses})
		}
	})
})


//continue mycourses
router.post("/:course_id/modules",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			console.log(err)
		}else{
			res.render("./courses/modules",{foundCourse : foundCourse})
		}
	})
})



router.post("/:course_id/orders",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			res.redirect("/");
		}else{
			User.findById(req.user._id,function(err,foundUser){
				foundUser.courses.push(foundCourse);
				foundUser.save();
				res.render("./courses/payment");
			})
		}
	})
})

//assignment
router.post("/:course_id/assignment/:ques_no",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			console.log(err)
		}else{
			res.render("./courses/assignment",{foundCourse:foundCourse,quesnum : req.params.ques_no})
		}
	})
})

//final exam
router.post("/:course_id/finalexam",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			res.redirect("back")
		}else{
			res.render("./courses/finalexam",{foundCourse:foundCourse})
		}
	})
})

//get certificate
router.post("/:course_id/certificate",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			res.redirect("back");
		}else{
			res.render("./courses/gen_certificate",{foundCourse : foundCourse})
		}
			
	})
})

//collab
router.post("/:course_id/collab",checkAuth,function(req,res){
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			res.redirect("back");
		}else{
			res.render("./courses/collab",{foundCourse : foundCourse});

		}
	})
})

router.post("/:user_id/collab/:course_id",function(req,res){
	var user2_email = req.body.email2;
	console.log(user2_email);
	
	Course.findById(req.params.course_id,function(err,foundCourse){
		if(err){
			res.redirect("/");
		}else{
			
			User.findById(req.user._id,function(err,foundUser1){
				if(err){
					req.flash("errormsg","user1 not found");

					res.redirect("back");
				}else{
					console.log(foundUser1)
					User.findOne({email : user2_email},function(err,foundUser2){
					 	if(err){
					 		req.flash("errormsg","user2 not found");
					     	res.redirect("/");
					 }else{
				 
						 
						foundUser1.courses.push(foundCourse);
					
						 foundUser1.save();
						foundUser2.courses.push(foundCourse);
					 		
						foundUser2.save();
					
						res.render("./courses/payment");
					 	}
					})
				}
				
		
				
			})
		}
	})
})

module.exports = router;