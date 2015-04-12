//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var connection = require('../config/sqldb.js');
var connection = require('../config/mysqlQuery');
var bcrypt   = require('bcrypt-nodejs');
var CompanyProfile = require('../models/CompanyModel');
var UserModel = require('../models/UserModel');



//DEFINE USER MODEL for serialization/deserialization purpose
function User(userId, email, password){

    this.userId = userId;
    this.email = email;
    this.password = password;
}


//DEFINE COMPANY MODEL for serialization/deserialization purpose
function Company(companyId, email, password, companyname){

    this.companyId = companyId;
    this.email = email;
    this.password = password;
    this.companyname = companyname;
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
        req.flash('message', 'Invalid input detected, please try again!');
        res.redirect('/');
        //res.render('signup', { message : "Enter valid email/password"});
    }
    
     console.log(email + " " + password);
    
        var userInfo = 'Select * from LoginDetails where email=' + "'"+ email +"'"; 
   
        connection.execQuery(userInfo, function(err, results, fields){
   
            if( (results[0] != undefined))
            {
                console.log("Results: " + results[0].email);
                
                if(results[0].email == email)
                {
                    req.flash('message', 'User already registered, please login!');
                    res.redirect('/');
                }    
            }
            
            else
            {
                console.log(email + " " + password);
                
                var insertUser  = 'Insert into LoginDetails (email, password, firstname, lastname) values ("' + email + '","' + password + '","' + firstname + '","' + lastname + '")' ;

                console.log("In registerNewUser()");

                connection.execQuery(insertUser, function(err, results, fields){

                        if(err){
                             req.flash('message', err);
                            res.redirect('/');
                        }
                        if(results != undefined){
                            console.log("Insert results: " + results);
                            console.log("User registered");
                            //res.render('signup', { message : "User registered, please proceed to login!" });    
                            next();
                        }
                        else{
                            
                            req.flash('message', 'Something went wrong, please try again!');
                            res.redirect('/');
                        }
           
                    });//inner query
                    
            }//else

    });
    
}//registernewuser


function updateLastLogin(username, fn)
{
    console.log("In update last login");
    
    var queryString = 'Update LoginDetails set LastLogIn = Now() where email =' + "'"+ username +"'"; 
    
    connection.execQuery(queryString, function(err, results, fields){
        
        console.log(JSON.stringify(results));

        
    });
}


//FIND USER IN DATABASE
function findByUser(username, fn)
{
     console.log("In findByUser " + username);
    
    var queryString = 'Select * from LoginDetails where email=' + "'"+ username +"'"; 
   
    connection.execQuery(queryString, function(err, results, fields){
    
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
    
    connection.execQuery(queryStr, function(err, results, fields){
       
        if(results[0].Id){
            var user =  new User();
            user.userId = results[0].Id;
            user.email = results[0].email;
            //user.password = results[0].password;
            user.firstname = results[0].firstname;
            user.lastname = results[0].lastname;
            
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
    
    connection.execQuery(queryStr, function(err, results, fields){
       
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



function saveUSerRegData(user, fn){
    
    var us = new UserModel;
    
    us.UserId = user.userId;
    us.Firstname = user.firstname;
    us.Lastname = user.lastname;
    us.Email = user.email;
    
      console.log("############## " + user +  " " + user.userId + " " + user.firstname);
    
    us.save(function(err){
        
        if(err)
        {
            throw err;
            return fn(err, false);
        }
        else{
            console.log("user profile added : " + us);
            return fn(err, true);
        }
    });
}


function saveCompanyRegData(user, fn){

    cm = new CompanyProfile;
    
    cm.UserId = user.companyId;
    cm.CompanyName = user.companyname;
    cm._id = user.companyId;
    
    
    console.log("############## " + user +  " " + user.companyId + " " + user.companyname);
    
    cm.save(function(err){
        
        if(err)
        {
            throw err;
            return fn(err, false);
        }
        else{
            console.log("company profile added : " + cm);
            return fn(err, true);
        }
    });
    
}


module.exports.registerNewUser = registerNewUser;


var passportAuth = function(passport){
        
    //serialize user to decide what to stor in session
    passport.serializeUser(function(user, done){
        
        console.log('In deserialize ' + user);
        
        //serialize the user
        if(user.userId != undefined)
        {
            console.log(' Serializing user ' + user);
            
            saveUSerRegData(user, function(err, flag){
                
                    console.log("flag, err" + flag + " " + err);
               
                    if(flag)
                    {
                        console.log("USER data saved");
                        done(null, {'user' : user.userId, 'email' : user.email, 'firstname' : user.firstname, 'lastname' : user.lastname});
                    }
                
                    done(null, {'user' : user.userId, 'email' : user.email, 'firstname' : user.firstname, 'lastname' : user.lastname});

            });
            
            //done(null, {'user' : user.userId, 'email' : user.email, 'firstname' : user.firstname, 'lastname' : user.lastname});
        }
        
        //serialize the company
        if(user.companyId != undefined)
        {
            console.log('@@@@@@@@@@@@@@@@@@@@@@ Serializing company ' + user);
            
            saveCompanyRegData(user, function(err, flag){
            
                    console.log("flag, err" + flag + " " + err);
                    if(flag)
                    {
                        console.log("Company data saved");
                         done(null, {'company' : user.companyId})
                    }
                
                  done(null, {'company' : user.companyId})

            });
            
            //done(null, {'company' : user.companyId})
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
                             req.flash('message', 'Login failed! Unknown user');
                            return done(null, false, {message: "Unknown user " + email}); 
                        }
                        if(!validatePassword(password, user.password)) 
                        {
                            console.log("checking secured password : " + user.password);
                             req.flash('message', 'Login failed! Invalid password');
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