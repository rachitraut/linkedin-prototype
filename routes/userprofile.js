var config = require('./models/auth');
var ddb = require('dynamodb').ddb({ accessKeyId:config.ACCESS_KEY,secretAccessKey: config.ACCESS_SECRET, endpoint:config.ENDPOINT});

exports.signup=function(req, res) {
  var item = {
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
  });
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
