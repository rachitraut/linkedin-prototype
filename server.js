//Linkedin Prototype0. In this below REST API's are created using Nodejs and database as RDS and 
//DynamoBD on the AWS. Authentication has to be done using the secret key and region mentioned in the app.config and 
//app.config1 files.
var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var fs = require('fs');
var AWS = require('aws-sdk');
var app = express();
var ddb = require('dynamodb');

app.set('port', process.env.PORT || 8081);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.locals.theme = process.env.THEME; //Make the THEME environment variable available to the app. 
var user = require('./routes/userprofile');
var company = require('./routes/companyprofile');
//Authorization values for connection
var config = require('./models/auth');

//Table value for user
var tables =require('./models/tables');
 
//Create SNS(Simple notification Service) client and pass in region.
var sns = new AWS.SNS({ region: config.AWS_REGION});

//GET home page.
app.get('/', routes.index);

//POST signup form.
app.post('/signup', user.signup); 

//UserProfile page
app.get('/userprofile',user.getProfile);

//Companyprofile page
app.get('/companyprofile',company.getProfile);

//Job posting to store the data in DynamoDB and below are the fields chosen for the same.
app.post('/jobpost',user.jobposts);

//Company profile information and job posting details of the company
app.post('/companyprofile',company.putdata);


http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
