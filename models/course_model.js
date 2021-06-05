const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
	name : String,
	image : String,
	course_provider: String,
	price : Number,
	Instructor_name : String,
	no_of_modules : Number,
	topics : [String],
	videos : [String],
	assignment : [
		{
			question: String,
			op1 : String,
			op2 : String,
			op3 : String,
			op4 : String,
			ans : String
		}
	]
	
	
})



const Course = mongoose.model("Course",courseSchema)

module.exports = Course;