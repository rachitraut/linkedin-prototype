var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var jobPost = new Schema({
			_id: String,
			CompanyId:String,
			JobName:String,
			KeyWords:[String],
	      	JobDescription:String,
	      	Location : String,
	    	PostDate:{type:Date},
	    	ExpiryDate:{type:Date}
			});

module.exports = mongoose.model("JobPosts",jobPost);