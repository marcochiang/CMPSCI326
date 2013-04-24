var tweetlib = require('../lib/users/tweets.js');


/*
 * Tweets
 */

exports.tweet = function(req, res){
	res.render('tweet', { title: 'Tweet' });
};

// Chat Module

var lastTweet = new Array();

// The post function will handle incoming posts and store them
// into the posts array. The client is expected to send a post
// request containing a single object: { text : <value> }.
exports.post = function (req, res) {
	console.log('exports.post method');
	var text = req.body.text;
	var u = req.session.user;
	tweetlib.createTweet(u, text, function(error, tweet){
		if (error){
			console.log('Error: ' + error);
			//render error page
			res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
		}
		else{
			var time = new Date(tweet.time);
			//lastID[tweet.uid] = time.toDateString();
			lastTweet[tweet.uid] = time.getTime();
			console.log('setting time of last tweet: ' + lastTweet[tweet.uid]);
			res.json({ status: 'OK'});
		}
	});
};

// The check function is used to check how many new posts are
// available given the last post the client has. The client is
// expected to send a post request with a JSON body containing
// a single object: { last : <value> }.
exports.check = function (req, res) {

	console.log('exports.check method');
	var u = req.session.user;
	if (u){//session defined
		//need to check if lastTweet array has been populated
		//if it has not, grab all tweets -- this is when the user first loads "Home" page
		if (lastTweet[u.uid]){
			tweetlib.getTweets(u, lastTweet[u.uid], function(error, tweets){
				if (error){
					console.log('Error: ' + error);
					//render error page
					res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
				}
				else{
					if (tweets){
						console.log('Printing tweets returned: ');
						for (var i=0; i<tweets.length; i++){
							var t = tweets[i];
							console.log(t.tweet);
						}
						var newTime = new Date();
						lastTweet[u.uid] = newTime.getTime();
						res.json(tweets);
					}
					else{
						console.log('no tweets returned');
						res.json("");
					}
				}
			});
		}
		else{
			console.log('No posts entered during session for ' + u.uname);
			tweetlib.getAllTweets(u, function(error, tweets){
				if (error){
					console.log('Error: ' + error);
					//render error page
					res.render('static/error', { title: 'Error', func: 'error', nav: false, error: error});
				}
				else{
					if (tweets){
						console.log('Printing tweets returned: ');
						for (var i=0; i<tweets.length; i++){
							var t = tweets[i];
							console.log(t.tweet);
						}
						var newTime = new Date();
						lastTweet[u.uid] = newTime.getTime();
						res.json(tweets);
					}
					else{
						console.log('no tweets returned');
						res.json("");
					}
				}
			});
		}
	}
};

exports.displayTweet = function (req, res) {

	var tweetID = req.params.tweetid;
	display = tweetID;
	res.render('tweets/displayTweet', {title: 'Tweet', func: 'displayTweet', nav: '', data: display});
	
};