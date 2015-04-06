var mysql = require('mysql');
var mysqlcon;

var connection = mysql.createConnection(
        {
            host : 'localhost',
            user : 'root',
            password: 'root',
            database : 'Users'

        });


module.exports = connection;
