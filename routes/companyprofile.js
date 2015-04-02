var config = require('../models/auth');
var ddb = require('dynamodb').ddb({ accessKeyId:config.ACCESS_KEY,secretAccessKey: config.ACCESS_SECRET, endpoint:config.ENDPOINT});

exports.putdata = function(req,res){
	var item = {
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
  });
};
	