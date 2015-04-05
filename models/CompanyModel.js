var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var JobPostsSchema = require("./JobPostsSchema");

var company = new Schema({
	UserId:Number, 
	CompanyId:Number,
	CompanyName:String, 
	JobPosts:[{
		JobName:String,
	      	JobDescription:String,
	    	PostDate:{type:Date},
	    	ExpiryDate:{type:Date}
	    	}]
});





module.exports = mongoose.model("CompanyProfile",company);

