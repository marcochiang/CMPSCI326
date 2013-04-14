// # User.js
// This is the routes module for accessing the dynamic views
// and elements of the app.

/*
 * GET users listing.
 */

var userlib = require('../lib/users/user.js');

// Renders the login view
exports.login = function(req, res) {

	// Grab any messages being sent to use from redirect.
	var authmessage = req.flash('auth') || '';
	var redir = req.query.redir || '';
	
	// TDR: redirect if logged in:
	var user  = req.session.user;
	
	// TDR: If the user is already logged in - we redirect to the
	// main application view.
	if (user !== undefined) {
		res.redirect('/');
	}
	else {
		// Render the login view if this is a new login.
		res.render('users/login', {title: 'Login', nav: 'login', func: 'login', message: authmessage});
	}
	
};

// ## auth
// Performs **basic** user authentication.
exports.loginAuth = function(req, res) {
	
	// Pull the values from the form.
	var username = req.body.user;
	var password = req.body.pass;
	// Perform the user lookup.
	userlib.auth(username, password, function(error, user) {
		if (error) {
			// If there is an error we "flash" a message to the
			// redirected route `/user/login`.
			req.flash('auth', error);
			//res.redirect('/login?redir='+req.body.redir);
			res.redirect('/login');
		}
		else {
			req.session.user = user;
			// Store the user in our in memory database.
			//online[user.uid] = user;
			// Redirect to main.
			res.redirect('/');
			//res.redirect(req.body.redir || '/');
		}
	});
	
};

// Renders the register view
exports.register = function(req, res) {

	var user  = req.session.user;
	
	if (user !== undefined) { //redirect to home if there is a current session
		res.redirect('/');
	}
	
	// Grab any messages being sent to use from redirect.
	var authmessage = req.flash('auth') || '';
	res.render('users/register', {title: 'Get Started', func: 'register', nav: 'register', message: authmessage});
	
};

exports.registerProcess = function(req, res) {

	// Pull the values from the form.
	var email1 = req.body.email1;
	var email2 = req.body.email2;
	var username = req.body.user;
	var password = req.body.pass;
	userlib.createUser(email1, email2, username, password, function(error, user) {
		if (error) {
			// If there is an error we "flash" a message to the
			// redirected route `/user/login`.
			req.flash('auth', error);
			res.redirect('/register');
		}
		else{
			req.session.user = user;
			// Store the user in our in memory database.
			//online[user.uid] = user;
			// Redirect to main.
			res.redirect('/');
		}
	});
	
};

// ## logout
// Deletes user info & session - then redirects to login.
exports.logout = function(req, res) {
	
	delete req.session.user;
	res.redirect('/login');
	
};