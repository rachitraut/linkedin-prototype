//Linkedin Prototype. In this below REST API's are created using Nodejs and database as RDS and 
//DynamoBD on the AWS. Authentication has to be done using the secret key and region mentioned in the app.config and 
//app.config1 files.


//AWS.config.update({ accessKeyId: "myKeyId", secretAccessKey: "secretKey", region: "us-east-1" });
//Need to add the above lines in the app.config files.
//arn:aws:dynamodb:region:account:table/tablename(used in the iam_policy file for SNS notifications)
//Get modules.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();

app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 

//Read config values from a JSON file.
var config = fs.readFileSync('./app_config.json', 'utf8');
config = JSON.parse(config);

var config1 = fs.readFileSync('./app_config1.json', 'utf8');
config1 = JSON.parse(config1); 

var config2 = fs.readFileSync('./app_config2.json', 'utf8');
config2 = JSON.parse(config2); 

//Create DynamoDB client and pass in region.
var db = new AWS.DynamoDB({region: config.AWS_REGION});
//Create SNS(Simple notification Service) client and pass in region.
var sns = new AWS.SNS({ region: config.AWS_REGION});

//GET home page.
app.get('/', routes.index);

//POST signup form.
app.post('/signup', function(req, res) {
  var nameField = req.body.name,
      emailField = req.body.email,
      passwordField = req.body.password,
      previewBool = req.body.previewAccess;
  res.send(200);
  signup(nameField, emailField,passwordField, passwordSubmitted, previewBool);
});

//Add signup form data to database this is the RDS database to be used and not Dynamo DB.
//have to look how to store the given into RDS when passing to the function signup
var signup = function (nameSubmitted, emailSubmitted, passwordSubmitted, previewPreference) {
  var formData = {
    TableName: config.STARTUP_SIGNUP_TABLE,
    Item: {
      email: {'S': emailSubmitted},
      password: {'S' : passwordSubmitted}, 
      name: {'S': nameSubmitted},
      preview: {'S': previewPreference}
    }
  };
  db.putItem(formData, function(err, data) {
    if (err) {
      console.log('Error adding item to database: ', err);
    } else {
      console.log('Form data added to database.');
      var snsMessage = 'New signup: %EMAIL%'; //Send SNS notification containing email from form.
      snsMessage = snsMessage.replace('%EMAIL%', formData.Item.email['S']);
      sns.publish({ TopicArn: config.NEW_SIGNUP_TOPIC, Message: snsMessage }, function(err, data) {
        if (err) {
          console.log('Error publishing SNS message: ' + err);
        } else {
          console.log('SNS message sent.');
        }
      });  
    }
  });
};

//Job posting to store the data in DynamoDB and below are the fields chosen for the same.
app.post('/jobpost',function (req,res){
  var jobIdField = req.body.jobId,
      jobTitleField = req.body.jobTitle,
      jobLocationField = req.body.jobLocation,
      jobDescriptionField = req.body.jobDescription,
      companyNameField = req.body.companyName,
      postedOnField = req.body.postedOn;
res.send(200);
posting(jobIdField,jobTitleField,jobLocationField,jobDescriptionField,companyNameField,postedOnField);
});

//Adding the job posting data to the DynamoDB
var posting = function (jobIdSubmitted,jobTitleSubmitted,jobLocationSubmitted,jobDescriptionSubmitted,companyNameSubmitted,postedOnSubmitted) 
{
  var postingData = {
    TableName: config1.JOB_POSTING_TABLE,
    jobId : {'N' : jobIdSubmitted},
    jobTitle : {'S' : jobTitleSubmitted},
    jobLocation : {'S' : jobLocationSubmitted},
    jobDescription : {'S' : jobDescriptionSubmitted},
    companyName : {'S' : companyNameSubmitted},
    postedOn : {'S' : postedOnSubmitted}
  };
  db.putItem(postingData,function(err,data){
    if (err) {
      console.log('Error adding item to database: ', err);
    }
    else {
      console.log('Posting data added to database.');
      var snsMessage = 'New Jobposted: %EMAIL%'; //Send SNS notification containing email from form.
      snsMessage = snsMessage.replace('%EMAIL%', formData.Item.email['S']); //mail notification to the user with the mail id stored in the RDS.
      sns.publish({ TopicArn: config1.NEW_JOB_POSTING_TOPIC, Message: snsMessage }, function(err, data) {
        if (err) {
          console.log('Error publishing SNS message: ' + err);
        } else {
          console.log('SNS message sent.');
        }
      });  
    }
  });
};

//Company profile information and job posting details of the company
app.post('/companyprofile',function (req,res){
  var companyIdField = req.body.companyId,
      companyTitleField = req.body.companyTitle,
      jobPostsField = req.body.jobPosts,
      companyDescriptionField = req.body.companyDescription,
      companyStatusField = req.body.companyStatus,
      companyFollowersField = req.body.companyFollowers;
res.send(200);
companyInfo(companyIdField,companyTitleField,jobPostsField,companyDescriptionField,companyStatusField,companyFollowersField);
});

//Adding the job posting data to the DynamoDB
var companyInfo = function (companyIdSubmitted,companyTitleSubmitted,jobPostsSubmitted,companyDescriptionSubmitted,companyStatusSubmitted,companyFollowersSubmitted) 
{
  var companyData = {
    TableName: config2.COMPANY_TABLE,
    companyId : {'N' : companyIdSubmitted},
    companyTitle : {'S' : companyTitleSubmitted},
    //jobPosts : {'S' : jobLocationSubmitted},
    jobPosts : [
         jobTitle : {'S' : jobTitleSubmitted},
         jobLocation : {'S' : jobLocationSubmitted},
         jobDescription : {'S' : jobDescriptionSubmitted}
    ],
    companyDescription : {'S' : companyDescriptionSubmitted},
    companyStatus : {'S' : companyStatusSubmitted},
    companyFollowers : {'S' : companyFollowersSubmitted}
  };
  db.putItem(companyData,function(err,data){
    if (err) {
      console.log('Error adding item to database: ', err);
    }
    else {
      console.log('companyData data added to database.');
      //Notification to be given to the company
      // var snsMessage = 'New Jobposted: %EMAIL%'; //Send SNS notification containing email from form.
      // snsMessage = snsMessage.replace('%EMAIL%', formData.Item.email['S']); //mail notification to the user with the mail id stored in the RDS.
      // sns.publish({ TopicArn: config1.NEW_JOB_POSTING_TOPIC, Message: snsMessage }, function(err, data) {
      //   if (err) {
      //     console.log('Error publishing SNS message: ' + err);
      //   } else {
      //     console.log('SNS message sent.');
      //   }
      // });  
    }
  });
};


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
