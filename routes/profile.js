
/*
 * GET profile page.
 */

exports.index = function(req, res){
  res.render('profile', { title: 'Profile' });
};