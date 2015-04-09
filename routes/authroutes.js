var connection = require('../config/sqldb.js');
var authHandle = require('../config/passportAuth.js');
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




router.get('/signup', function(req, res){
    res.render('signup', { message: req.flash('signupMessage') });
});



router.post('/signup', authHandle.registerNewUser);


router.get('/login', function(req, res){
 
    res.render('login', { user: req.user, message: req.flash('error') });
});



router.post('/login', passport.authenticate('local-login', { successRedirect : '/profile', 
                                               failureRedirect : '/login', 
                                               failureFlash : true 
      }));

router.get('/profile', isLoggedIn, function(req, res){
    
    res.render('profile', { user : req.user});
});


router.get('/logout', function(req, res){
    
    req.logout();
    res.redirect('/');
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



/*=========== HELPER FUNCTIONS ===========================*/


function isLoggedIn(req, res, next)
{
    if(req.isAuthenticated())
        console.log("After req.isAuthenticated().....");
        return next();
    
    res.redirect('/');
}

module.exports = router;
