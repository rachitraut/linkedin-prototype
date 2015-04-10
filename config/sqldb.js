var mysql = require('mysql');
var mysqlcon;

var connection = mysql.createConnection(
        {
            host : 'localhost',
            user : 'root',
            password: 'root',
            database : 'Users'

        });


exports.getConnection = function()
{
    /*if(connection.threadId != null)
    {
        console.log("MYSQL connection object :" + connection.threadId);
    }
    else
    {
        connectToMySql();
    }*/
    
    connectToMySql();
    
    return connection;
}
 

var connectToMySql = exports.connectToMySql = function(){
    
    connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }
            console.log('connected to mysql as id ' + connection.threadId);
          
});
    
}


//module.exports = connection;
