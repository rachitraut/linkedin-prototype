var config = require('../models/auth');
var ddb = require('dynamodb').ddb({ accessKeyId:config.ACCESS_KEY,secretAccessKey: config.ACCESS_SECRET, endpoint:config.ENDPOINT});
CompanyProfile = require('../models/CompanyModel');
JobPostsSchema = require('../models/JobPostsSchema');
exports.postCompany = function(req,res){
	/*var item = {
			userId :req.body.userId,
		    TableName: req.body.TableName,
		    companyId : req.body.companyId,
		    companyTitle : req.body.companyTitle,
		    //jobPosts : {'S' : jobLocationSubmitted},
		    jobPosts : [{
		         jobTitle  : req.body.jobTitle,
		         jobLocation : req.body.jobLocation,
		         jobDescription : req.body.jobDescription
		         }],
		    companyDescription : req.body.companyDescription,
		    companyStatus : req.body.companyStatus,
		    companyFollowers : req.body.companyFollowers
		};
	ddb.putItem('companyData',item,{}, function(err, res,cap) {
	    if (err) {
	      console.log('Error adding item to database: ', err);
	  
	    } else {
	      console.log('Form data added to database.');  
	    }
  });*/
	
	
	var date = new Date(req.body.JobPostsExpiryDate);
	cm = new CompanyProfile;
	cm.UserId = req.body.UserId;
	cm.CompanyId = req.body.CompanyId;
	cm.CompanyName = req.body.CompanyName;
	//console.log("Now date : " + jm.PostDate);
	//console.log("Expired date : " + date);
	cm.JobPosts.push({
		JobName : req.body.JobPostsJobName,
		JobDescription : req.body.JobPostsJobDescription,
		PostDate : new Date,
		ExpiryDate : date});
	/*cm.JobPosts.JobName = req.body.JobPostsJobName;
	cm.JobPosts.JobDescription = req.body.JobPostsJobDescription;
	cm.JobPosts.PostDate = req.body.JobPostsPostDate;
	cm.JobPosts.ExpiryDate = req.body.JobPostsExpiryDate;*/
	cm.save(function(err){
		if(err)
			throw err;
		console.log("company profile added : " + cm);
	});		
	res.end();
};
	