exports.createMongoConnection = function()
{

var mongoose = require("mongoose");
var dbURI = "mongodb://cmpe282:cmpe282@ds061371.mongolab.com:61371/cmpe282";
//var dbURI = "mongodb://localhost:27017/proxydb"
mongoose.connect(dbURI);

// CONNECTION EVENTS
	// When successfully connected
	mongoose.connection.on('connected', function () {
	  console.log('Mongoose default connection open to ' + dbURI);
	});
	 
	// If the connection throws an error
	mongoose.connection.on('error',function (err) {
    console.log('Mongoose default connection error: ' + err);
	});
	 
	// When the connection is disconnected
	mongoose.connection.on('disconnected', function () {
	  console.log('Mongoose default connection disconnected');
	});
}