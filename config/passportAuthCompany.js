//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
//var connection = require('../config/sqldb.js');
var connection = require('../config/mysqlQuery');
var bcrypt   = require('bcrypt-nodejs');

var CompanyProfile = require('../models/CompanyModel');


//DEFINE USER MODEL
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
function validatePassword(password, companypassword) {
    return bcrypt.compareSync(password, companypassword);
};



//FIND COMPANY IN DATABASE
function findByCompany(companyname, fn)
{
     console.log("In findByCompany " + companyname);
    
    var queryString = 'Select * from CompanyLoginDetails where email=' + "'"+ companyname +"'"; 
   
    connection.execQuery(queryString, function(err, results, fields){
    
        console.log("rows : "+ results + " fields: " + fields);
        
        if(results[0] != undefined){
        
            console.log("Company : " + results[0].email + " " +results[0].password);
            
            if(results[0].email == companyname)
            {
                var company =  new Company();
                company.companyId = results[0].CompanyId;
                company.email = results[0].email;
                company.password = results[0].password;
                company.companyname = results[0].companyname;

                return fn(null, company);
            }

        }
        return fn(null, false);
    });
    
}


function updateLastLogin(companyname, fn)
{
    console.log("In update last login");
    
    var queryString = 'Update CompanyLoginDetails set LastLogIn = Now() where email =' + "'"+ companyname +"'"; 
    
    connection.execQuery(queryString, function(err, results, fields){
        
        console.log(JSON.stringify(results));

        
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



//to register a new user
var registerNewCompany =  function (req, res, next)
{
    var email = req.body.email;
    //securely hash the password before storing in DB
    var password = generateHash(req.body.password);
    var companyname = req.body.companyname;
    
    if(email === 'undefined' || password === 'undefined')
    {
         req.flash('message', 'Invalid input, please try again!');
         res.redirect('/');
        //res.render('signup', { message : "Enter valid email/password"});
    }
    
     console.log(email + " " + password);
    
        var qrStr = 'Select * from CompanyLoginDetails where email=' + "'"+ email +"'"; 
   
        connection.execQuery(qrStr, function(err, results, fields){
   
            if( (results[0] != undefined))
            {
                console.log("Results: " + results[0].email);
                
                if(results[0].email == email)
                {
                    req.flash('message', 'Company already registered, please login!');
                    res.redirect('/');
                }    
            }
            
            else
            {
                console.log(email + " " + password);
                
                var queryString  = 'Insert into CompanyLoginDetails (email, password, companyname) values ("' + email + '","' + password + '","' + companyname + '")' ;

                console.log("In registerNewCompany()");

                connection.execQuery(queryString, function(err, results, fields){

                        if(err){
                            console.log(err);
                             req.flash('message', "Something went wrong, please try again!" );
                            res.redirect('/');
                        }
                        if(results != undefined){
                            
                            console.log("Insert results: " + JSON.stringify(results));

                            var company = new Company;
                            company.companyId = results.insertId;
                            company.companyname = req.body.companyname;

                             //save minimum registration data in mongodb too
                            saveCompanyRegData(company, function(err, flag){

                                if(err)
                                {
                                    req.flash('message', "Something went wrong, please try again!" );
                                    res.redirect('/');
                                }

                                if(flag)
                                {
                                    console.log("Company registration data saved");
                                    next();
                                }

                            });
                           
                             //next();
                               
                        }
                        else{
                            req.flash('message', "Something went wrong, please try again!" );
                            res.redirect('/');
                        }
           
                    });//inner query
                    
            }//else

    });    
};//registernewuser

module.exports.registerNewCompany = registerNewCompany;


var passportAuthCompany = function(passport){
        


    /*========== LOCAL COMPANY LOGIN ======================*/
    
    passport.use('local-company-login', new LocalStrategy(
                {
                 usernameField : 'email', 
                 passwordField: 'password',
                 passReqToCallback : true 

                }, 
              
                function(req, email, password, done){

                    console.log("In passport.use " + email);
                    //for async processing.... now findByUser would only be called after data (username and password) is available
                    process.nextTick(function(){

                    findByCompany(email, function(err, company){

                        console.log("After callback");

                        if(err) { return done(err); }
                        if(!company) 
                        {   
                            console.log("After callback, in not Company"); 
                            req.flash('message', 'Login failed! Unknown company');
                            return done(null, false, {message: "Unknown company " + email}); 
                        }
                        if(!validatePassword(password, company.password)) 
                        {
                            console.log("checking secured password : " + company.password);
                            req.flash('message', 'Invalid password');
                            return done(null, false, {message : "Invalid password"}); 
                        }
                        updateLastLogin(email);
                        
                        return done(null, company);
                    });
                });
            }
    ));

}//function


module.exports.passportAuthCompany = passportAuthCompany;