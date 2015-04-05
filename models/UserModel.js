var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var user = new Schema({UserId:Number, 
					   FirstName:String, 
					   LastName:String, 
					   Bio: String, 
					   Country:String, 
					   ZipCode: Number,
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
						  StartDate:String,
						  EndDate:String
						  },
					  UserFollowed:[Number],
					  CompanyFollowed:[Number]
					  });

module.exports = mongoose.model("UserProfile", user);