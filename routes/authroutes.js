//var connection = require('../config/sqldb.js');
var authHandle = require('../config/passportAuth.js');
var authHandleCompany = require('../config/passportAuthCompany');
var user = require('../routes/userprofile.js');
var company = require('../routes/companyprofile.js');
var routes = require('../routes/index.js');

var express = require('express');
var router = express.Router();
var passport = require('passport');


/* GET home page. */
router.get('/home', function(req, res, next) {
  res.render('home', { title: 'Express' });
});


/* USER login */

router.post('/signup/user', authHandle.registerNewUser, passport.authenticate('local-login', { successRedirect : '/profile/user', 
                                               failureRedirect : '/login/user', 
                                               failureFlash : true 
      }));


router.post('/login/user', passport.authenticate('local-login', { successRedirect : '/profile/user', 
                                               failureRedirect : '/login/user', 
                                               failureFlash : true 
      }));


router.get('/signup/user', function(req, res){
    res.render('signup', { message: req.flash('signupMessage') });
});


//get login page for user
router.get('/login/user', function(req, res){
 
    res.render('login', { user: req.user, message: req.flash('error') });
});


router.get('/logout/user', function(req, res){
    
    req.logout();
    res.redirect('/');
});


router.get('/profile/user', isLoggedIn, function(req, res){
    
    res.render('profile', { user : req.user});
});




/* COMPANY login and sign up routes*/


router.get('/signup/company', function(req, res){
    res.render('companysignup', { message: req.flash('signupMessage') });
});


router.post('/signup/company', authHandleCompany.registerNewCompany, passport.authenticate('local-company-login', { successRedirect : '/profile/company',
                                                                           failureRedirect : '/login/company',
                                                                           failureFlash : true
   }));

router.get('/login/company', function(req, res){
    
    res.render('companylogin', {user: req.company, message: req.flash('error')});
});


router.post('/login/company', passport.authenticate('local-company-login', { successRedirect : '/profile/company',
                                                                           failureRedirect : '/login/company',
                                                                           failureFlash : true
   }));


router.get('/logout/company', function(req, res){
    
    req.logout();
    res.redirect('/');
});

router.get('/profile/company', isLoggedIn, function(req, res){
    
    
    console.log("From backend: " + JSON.stringify(req.user));
    
    res.render('profile', { user : req.user});
});



router.get('/', routes.index);

//profile edit page.
router.get('/editProfile',user.viewProfile);

//UserProfile page
router.get('/userProfile',user.getProfile);

//Companyprofile page
//router.get('/companyprofile',company.getProfile);


//Company profile information and job posting details of the company
router.post('/companyProfile',company.postCompany);

//save profile info for users
router.post('/userProfile',user.postProfile);

//Companyprofile page
router.get('/editCompanyProfile',company.getEditProfile);

//save jobPosts in the company
router.post('/postJob',company.jobPosts);

router.get('/getJob',company.getJobPosts);


/*=========== HELPER FUNCTIONS ===========================*/


function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
        console.log("After req.isAuthenticated().....");
        return next();
    
    res.redirect('/');
}

module.exports = router;
