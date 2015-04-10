//var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var connection = require('../config/sqldb.js');

var bcrypt   = require('bcrypt-nodejs');


var connection = connection.getConnection();

//DEFINE USER MODEL
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
function validatePassword(password, companypassword) {
    return bcrypt.compareSync(password, companypassword);
};



//FIND COMPANY IN DATABASE
function findByCompany(companyname, fn)
{
     console.log("In findByCompany " + companyname);
    
    var queryString = 'Select * from CompanyLoginDetails where email=' + "'"+ companyname +"'"; 
   
    connection.query(queryString, function(err, results, fields){
    
        console.log("rows : "+ results + " fields: " + fields);
        
        if(results[0] != undefined){
        
            console.log("Company : " + results[0].email + " " +results[0].password);
            
            if(results[0].email == companyname)
            {
                var company =  new Company();
                company.companyId = results[0].CompanyId;
                company.email = results[0].email;
                company.password = results[0].password;

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
    
    connection.query(queryString, function(err, results, fields){
        
        console.log(JSON.stringify(results));

        
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
        res.render('signup', { message : "Enter valid email/password"});
    }
    
     console.log(email + " " + password);
    
        var qrStr = 'Select * from CompanyLoginDetails where email=' + "'"+ email +"'"; 
   
        connection.query(qrStr, function(err, results, fields){
   
            if( (results[0] != undefined))
            {
                console.log("Results: " + results[0].email);
                
                if(results[0].email == email)
                {
                    console.log("Rendering signup");
                    res.render('signup', { message : "Company already registered!" });
                }    
            }
            
            else
            {
                console.log(email + " " + password);
                
                var queryString  = 'Insert into CompanyLoginDetails (email, password, companyname) values ("' + email + '","' + password + '","' + companyname + '")' ;

                console.log("In registerNewCompany()");

                connection.query(queryString, function(err, results, fields){

                        if(err){
                            console.log(err);
                            res.render('signup', { message : "Error occured! Please try again!"});
                        }
                        if(results != undefined){
                            console.log("Insert results: " + results);
                            console.log("Company registered");
                            //res.render('signup', { message : "Company registered, please proceed to login!" }); 
                            next();
                        }
                        else{
                            res.render('signup', { message : "Error occured! Please try again!"});
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
                            return done(null, false, {message: "Unknown company " + email}); 
                        }
                        if(!validatePassword(password, company.password)) 
                        {
                            console.log("checking secured password : " + company.password);
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