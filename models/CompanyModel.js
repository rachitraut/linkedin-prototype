var mongoose = require("mongoose");
var Schema = mongoose.Schema;
//var JobPostsSchema = require("./JobPostsSchema");

var company = new Schema({
	_id:String,
	UserId:Number,
	CompanyName:String,
	Adress:String,
	Country:String,
	Zip:String,
	Overview:String,
	Url:String,
	Founded:String,
	Numoffollowers: Number,
	JobPosts:[String]
});



module.exports = mongoose.model("CompanyProfile",company);

