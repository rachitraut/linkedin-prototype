var mysql_pool = require('mysql');
var pool  = mysql_pool.createPool({
	host     : 'localhost',
	user     : 'root',
	password : 'root',
	port     : '3306',
	database : 'Users',
	connectionLimit : '10'
});

exports.pool = pool;