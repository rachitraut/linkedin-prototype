var config = require('../models/auth');
var ejs = require("ejs");
var async = require("async");
var	UserModel = require('../models/UserModel');
var CompanyModel = require('../models/CompanyModel');
var JobPosts = require('../models/JobPostsModel');

exports.getProfile = function(req,res){
	
	UserModel.findOne({"UserId":1},function(err,response){
		if(err)
			console.log(err);
		console.log("response is "+ response);
		res.json(response);
	}); 
};

exports.viewProfile = function(req,res){
	/*ejs.renderFile('./views/editprofile.ejs',function(err, result) {
		   // render on success
		   if (!err) {
		            res.end(result);
		   }
		   // render or error
		   else {
			   
		            res.end('An error occurred');
		            console.log(err);
		   }
	   });*/
	
	    res.render('editProfile', { message : req.user });

};
exports.postProfile = function(req,res){
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

exports.getUserFollowing = function(req,res){
	var users = [];
	UserModel.findOne({"UserId" : 1}, function(err, response) {
		if (err)
			console.log(err);
		var userFollowedArray = response.UserFollowed;
		async.each(userFollowedArray,
				function(id,callback){
				UserModel.findOne({"UserId" : id},'UserId FirstName LastName Posts', function(err, response) {
					users.push(response);
					callback();
				});
		},
		function(err){
			res.json(users);
		}
	);
	});
}

exports.getCompanyFollowing = function(req,res){
	
	var companies = [];
	UserModel.findOne({"UserId" : 1}, function(err, response) {
		if (err)
			console.log(err);
		var companyFollowedArray = response.CompanyFollowed;
		async.each(companyFollowedArray,
				function(id,callback){
					CompanyModel.findOne({"CompanyId" : id},'CompanyId CompanyName', function(err, response) {
					companies.push(response);
					callback();
					});
				},
				function(err){
					res.json(companies);
				}
				);
			});
}

exports.getJobPosts = function(req,res){
	var posts = [];
	var postlist = [];
	var postArray = [];
	UserModel.findOne({"UserId" : 1}, function(err, response) {
		if (err)
			console.log(err);
		var companyFollowedArray = response.CompanyFollowed;
		async.each(companyFollowedArray,
				function(id,callback){
					CompanyModel.findOne({"CompanyId" : id}, function(err, resp) {
						postArray.push(resp.JobPosts);
						callback();
					});				
				},
				function(err){
					var str = postArray.toString();
					var arr =str.split(',')
					async.each(arr,
							function(pid,back){
								JobPosts.findOne({"_id":pid},'CompanyName CompanyId JobName JobDescription',function(err,response){
									posts.push(response);
									back();
								});
					},function(err){
						res.json(posts);
						
					});	
				});
			});
};