var config = require('../models/auth');
var ejs = require("ejs");
var ddb = require('dynamodb').ddb({ accessKeyId:config.ACCESS_KEY,secretAccessKey: config.ACCESS_SECRET, endpoint:config.ENDPOINT});
CompanyProfile = require('../models/CompanyModel');
JobPosts = require('../models/JobPostsModel');
exports.getEditProfile = function(req,res){
	ejs.renderFile('./views/companyeditprofile.ejs',function(err, result) {
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
}
exports.postCompany = function(req,res){
	
	
	cm = new CompanyProfile;
	var date = Date.now();
	var h = date.toString();
	console.log(h);
	cm._id = h;
	cm.UserId = 1;
	cm.CompanyName = req.body.CompanyName;
	cm.Adress = req.body.Adress;
	cm.Country = req.body.Country;
	cm.Zip = req.body.Zip;
	cm.Overview = req.body.Overview;
	cm.Url = req.body.Url;
	cm.Founded = req.body.Founded;
	//console.log("Now date : " + jm.PostDate);
	//console.log("Expired date : " + date);
	/*cm.JobPosts.push({
		JobName : req.body.JobPostsJobName,
		JobDescription : req.body.JobPostsJobDescription,
		PostDate : new Date,
		ExpiryDate : date});*/
	/*cm.JobPosts.JobName = req.body.JobPostsJobName;
	cm.JobPosts.JobDescription = req.body.JobPostsJobDescription;
	cm.JobPosts.PostDate = req.body.JobPostsPostDate;
	cm.JobPosts.ExpiryDate = req.body.JobPostsExpiryDate;*/
	cm.save(function(err){
		if(err)
			throw err;
		console.log("company profile added : " + cm);
	});		
	res.end("Company profile added");
};

exports.jobPosts = function(req,res){

	jp = new JobPosts;
	var date = Date.now();
	var h = date.toString();
	console.log(h);
	jp._id = h;
	jp.JobName = req.body.JobName;
	jp.JobDescription = req.body.JobDescription;
	jp.PostDate = new Date;
	jp.ExpiryDate = new Date(req.body.ExpiryDate);
	
	jp.save(function(err){
		if(err)
			throw err;
		console.log("job post added : " + jp);
	});
	CompanyProfile.findOne({'CompanyId':req.body.CompanyId},function(err,response){
		if (err)
			throw err;
		response.JobPosts.push(h);
		response.save(function(err){
			if(err)
				throw err;
			console.log(response);
		});
		
	});
	res.end();
	
	
};
	