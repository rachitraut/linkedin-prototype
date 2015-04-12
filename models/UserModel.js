var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var user = new Schema({UserId:Number, 
					   FirstName:String, 
					   LastName:String, 
					   Address:String,
					   Country:String, 
					   ZipCode: Number,
					   Bio: String,
					   Email:String,
					   Company:{
				   		  Name:String,
				   		  Title:String, 
				   		  StartDate: String,
				   		  EndDate:String,
				   		  Description:String
						   		},
					  Education:{
						  School:String,
						  Degree:String,
						  Field:String,
						  Level:String,
						  Grade:String,
						  StartDate:String,
						  EndDate:String
						  },
					  Posts:String,
					  UserFollowed:[Number],
					  CompanyFollowed:[Number]
					  });

module.exports = mongoose.model("UserProfile", user);