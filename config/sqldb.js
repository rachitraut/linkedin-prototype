var mysql = require('mysql');
var mysqlcon;

var connection = mysql.createConnection(
        {
            host : 'demoapp.cnfiarybvhfe.us-west-1.rds.amazonaws.com:3306',
            user : 'root',
            password: '12345678',
            database : 'sampledb'

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
