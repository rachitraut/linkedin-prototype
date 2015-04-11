var config = require('../models/auth');
var ejs = require("ejs");
	UserModel = require('../models/UserModel');
//var ddb = require('dynamodb').ddb({ accessKeyId:config.ACCESS_KEY,secretAccessKey: config.ACCESS_SECRET, endpoint:config.ENDPOINT});

exports.signup=function(req, res) {
  /*var item = {
		  userId : req.body.userId,
		  nameField : req.body.name,
		  emailField : req.body.email,
		  passwordField : req.body.password,
		  previewBool : req.body.previewAccess
      };
  ddb.putItem('userData',item,{}, function(err, res,cap) {
	    if (err) {
	      console.log('Error adding item to database: ', err);
	  
	    } else {
	      console.log('Form data added to database.');
	     
	    }
  });*/
	
};

exports.jobposts=function(req, res){
	var item = {
			userId :userId,
			jobId : req.body.jobId,
			jobTitle : req.body.jobTitle,
			jobLocation : req.body.jobLocation,
			jobDescription : req.body.jobDescription,
			companyName : req.body.companyNameSubmitted,
			postedOn : req.body.postedOn
	};
	
	ddb.putItem('userData',item,{}, function(err, res,cap) {
	    if (err) {
	      console.log('Error adding item to database: ', err);
	  
	    } else {
	      console.log('Form data added to database.');
	     
	    }
  });
};

exports.getProfile = function(req,res){
	
	
	
    ejs.renderFile('./views/userprofile.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
    
  
};

exports.viewProfile = function(req,res){
	ejs.renderFile('./views/editprofile.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
			   
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });
};
exports.postProfile = function(req,res){
	/*var item = {
			userId : "4",
			school : req.body.school,
			field : req.body.field
			};
	console.log(item);
	ddb.putItem('userData',item,{}, function(err, res,cap) {
	    if (err) {
	      console.log('Error adding item to database: ', err);
	      
	    } else {
	      console.log('Form data added to database.');
	     
	    }
  });*/
	um = new UserModel;
	um.UserId = 001//req.body.UserId;
	um.FirstName = "Yash"//req.body.FirstName;
	um.LastName = "Oswal"//req.body.LastName;
	um.Address = req.body.Address;
	um.Country = req.body.Country;
	um.ZipCode = req.body.ZipCode;
	um.Bio = req.body.Bio;
	um.Company.Name = req.body.CompanyName;
	um.Company.Title = req.body.CompanyTitle;
	um.Company.StartDate = req.body.CompanyStartDate;
	um.Company.EndDate = req.body.CompanyEndDate;
	um.Company.Description = req.body.CompanyDescription;
	um.Education.School = req.body.EducationSchool;
	um.Education.Degree = req.body.EducationDegree;
	um.Education.Field = req.body.EducationField;
	um.Education.Level = req.body.Level;
	um.Education.Grade = req.body.Grade;
	um.Education.StartDate = req.body.EducationStartDate;
	um.Education.EndDate = req.body.EducationEndDate;
	
	um.save(function(err){
		if(err)
			throw err;
		console.log("user profile added : " + um);
	});		
	res.end("Profile Saved!!");
};