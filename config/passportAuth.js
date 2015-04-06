//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('../config/sqldb.js');

var bcrypt   = require('bcrypt-nodejs');



//CONNECT TO MYSQL
    connection.connect(function(err) {
          if (err) {
            console.error('error connecting: ' + err.stack);
            return;
          }

            console.log('connected  as id ' + connection.threadId);
          
    });


//DEFINE USER MODEL
function User(userId, email, password){

    this.userId = userId;
    this.email = email;
    this.password = password;
}


//generate hash of password to securelyy store it in db
function generateHash(password)
{
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

//validate password entered against password retrieved from db 
function validatePassword(password, userpassword) {
    return bcrypt.compareSync(password, userpassword);
};



//FIND USER IN DATABASE
function findByUser(username, fn)
{
     console.log("In findByUser " + username);
    
    var queryString = 'Select * from LoginDetails where email=' + "'"+ username +"'"; 
   
    connection.query(queryString, function(err, results, fields){
    
        console.log("rows : "+ results + " fields: " + fields);
        
        console.log("User : " + results[0].email + " " +results[0].password);
        
        if(results[0].email == username)
        {
            var user =  new User();
            user.userId = results[0].Id;
            user.email = results[0].email;
            user.password = results[0].password;
            
            return fn(null, user);
        }
        
        return fn(null, null);
    });
    
}


function findById(userid, fn)
{
    var queryStr = 'Select * from LoginDetails where Id=' + "'"+ userid +"'";
    
    connection.query(queryStr, function(err, results, fields){
       
        if(results[0].Id){
            var user =  new User();
            user.userId = results[0].Id;
            user.email = results[0].email;
            user.password = results[0].password;
            
            fn(null, user);
        }
        else{
         
            fn(new Error("User " + userid + " does not exists"));
        }
        
    });
    
}


//to register a new user
var registerNewUser =  function (req, res, next)
{
    var email = req.body.email;
    //securely hash the password before storing in DB
    var password = generateHash(req.body.password);
    var firstname = req.body.firstname;
    var lastname = req.body.lastname;
    
    if(email === 'undefined' || password === 'undefined')
    {
        res.render('signup', { message : "Enter valid email/password"});
    }
    
     console.log(email + " " + password);
    
        var qrStr = 'Select * from LoginDetails where email=' + "'"+ email +"'"; 
   
        connection.query(qrStr, function(err, results, fields){

   
            if( (results[0] != undefined))
            {
                console.log("Results: " + results[0].email);
                
                if(results[0].email == email)
                {
                    console.log("Rendering signup");
                    res.render('signup', { message : "User already registered!" });
                }    
            }
            
            else
            {
                console.log(email + " " + password);
                
                var queryString  = 'Insert into LoginDetails (email, password, firstname, lastname) values ("' + email + '","' + password + '","' + firstname + '","' + lastname + '")' ;

                console.log("In registerNewUser()");

                connection.query(queryString, function(err, results, fields){

                        if(err){
                            console.log(err);
                            res.render('signup', { message : "Error occured! Please try again!"});
                        }
                        if(results != undefined){
                            console.log("Insert results: " + results);
                            console.log("User registered");
                            res.render('signup', { message : "User registered, please proceed to login!" });    
                        }
                        else{
                            res.render('signup', { message : "Error occured! Please try again!"});
                        }

                        
                    });//inner query
                    
            }//else

    });    
};//registernewuser

module.exports.registerNewUser = registerNewUser;


var passportAuth = function(passport){
        
//
    passport.serializeUser(function(user, done){
        done(null, user.userId);
    });

    //
    passport.deserializeUser(function(id, done){
        findById(id, function(err, user){
            done(err, user);
        });
    });

    

    /*========== LOCAL LOGIN ======================*/
    
    passport.use('local-login', new LocalStrategy(
                {
                 usernameField : 'email', 
                 passwordField: 'password',
                 passReqToCallback : true 

                }, 
              
                function(req, email, password, done){

                    console.log("In passport.use " + email);
                    //for async processing.... now findByUser would only be called after data (username and password) is available
                    process.nextTick(function(){

                    findByUser(email, function(err, user){

                        console.log("After callback");

                        if(err) { return done(err); }
                        if(!user) 
                        {   
                            console.log("After callback, in not user"); 
                            return done(null, false, {message: "Unknown user " + email}); 
                        }
                        if(!validatePassword(password, user.password)) 
                        {
                            console.log("checking secured password : " + user.password);
                            return done(null, false, {message : "Invalid password"}); 
                        }
                        return done(null, user);
                    });
                });
            }
    ));

}//function


module.exports.passportAuth = passportAuth;