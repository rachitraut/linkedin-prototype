var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var jobPost = new Schema({
			_id: String,
			CompanyId:String,
			CompanyName:String,
			JobName:String,
			KeyWords:[String],
			SkillSet:String,
	      	JobDescription:String,
	      	JobLocation : String,
	    	PostDate:{type:Date},
	    	ExpiryDate:{type:Date}
			});

module.exports = mongoose.model("JobPosts",jobPost);