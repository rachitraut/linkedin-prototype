
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('LinkedInHome', { message: req.flash('message')});
};
