// # Tweet Library

// ### Tweet Objects
function Tweet(message, cb){
	if (message.length > 140){
		cb('message is too long');
	}
	this.message = message;
}

//stub database
//userid, tweet
var tweetdb = [
	new Tweet(1. 'this is my first tweet'),
	new Tweet(1, 'this is my second tweet'),
	new Tweet(2, 'and so on')
];

function createTweet(message){

}
