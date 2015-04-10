//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('../config/sqldb.js');

var bcrypt   = require('bcrypt-nodejs');

var connection = connection.getConnection();


//DEFINE USER MODEL for serialization/deserialization purpose
function User(userId, email, password){

    this.userId = userId;
    this.email = email;
    this.password = password;
}


//DEFINE COMPANY MODEL for serialization/deserialization purpose
function Company(companyId, email, password){

    this.companyId = companyId;
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
                            //res.render('signup', { message : "User registered, please proceed to login!" });    
                            next();
                        }
                        else{
                            res.render('signup', { message : "Error occured! Please try again!"});
                        }
           
                    });//inner query
                    
                newConnection.end();
            }//else

    });
    
}//registernewuser


function updateLastLogin(username, fn)
{
    console.log("In update last login");
    
    var queryString = 'Update LoginDetails set LastLogIn = Now() where email =' + "'"+ username +"'"; 
    
    connection.query(queryString, function(err, results, fields){
        
        console.log(JSON.stringify(results));

        
    });
}


//FIND USER IN DATABASE
function findByUser(username, fn)
{
     console.log("In findByUser " + username);
    
    var queryString = 'Select * from LoginDetails where email=' + "'"+ username +"'"; 
   
    connection.query(queryString, function(err, results, fields){
    
        console.log("rows : "+ results + " fields: " + fields);
        
        //if user does not exist
        if(results[0] != undefined)
        {
            console.log("User : " + results[0].email + " " +results[0].password);  
            
            if(results[0].email == username)
            {
                var user =  new User();
                user.userId = results[0].Id;
                user.email = results[0].email;
                user.password = results[0].password;

                return fn(null, user);
            }
        }
    
        return fn(null, false);
    });
    
}


function findUserById(userid, fn)
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


function findCompanyById(companyid, fn)
{
    var queryStr = 'Select * from CompanyLoginDetails where CompanyId=' + "'"+ companyid +"'";
    
    connection.query(queryStr, function(err, results, fields){
       
        if(results[0].CompanyId){
            var company =  new Company();
            company.companyId = results[0].CompanyId;
            company.email = results[0].email;
            company.password = results[0].password;
            
            fn(null, company);
        }
        else{
         
            fn(new Error("Company " + companyid + " does not exists"));
        }
        
    });
    
}



module.exports.registerNewUser = registerNewUser;


var passportAuth = function(passport){
        
    //serialize user to decide what to stor in session
    passport.serializeUser(function(user, done){
        
        console.log('******************* In deserialize ' + user);
        
        if(user.userId != undefined)
        {
            console.log('@@@@@@@@@@@@@@@@@ Serializing user ' + user);
            done(null, {'user' : user.userId});
        }
        if(user.companyId != undefined)
        {
            console.log('@@@@@@@@@@@@@@@@@@@@@@ Serializing company ' + user);
            done(null, {'company' : user.companyId})
        }
        
    });

    //deserialize user to get data and then authenticate 
    passport.deserializeUser(function(obj, done){
               
        
        
        if(obj.user != undefined)
        {
            console.log('****************** Deserializing user ' + obj.user);
                findUserById(obj.user, function(err, user)
                {
                    done(err, user);
                });
        }
        if(obj.company != undefined)
        {
            console.log('******************** Deserializing company ' + obj.company);
            findCompanyById(obj.company, function(err, company)
            {
                    done(err, company);
            });
        }
        
      
    });

    

    /*========== LOCAL USER LOGIN ======================*/
    
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
                        updateLastLogin(email);
                        
                        return done(null, user);
                    });
                });
            }
    ));

}//function


module.exports.passportAuth = passportAuth;