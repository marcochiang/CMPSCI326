// # Tweet Library
var sqlite3 = require('sqlite3');
var async   = require('async');

// Connect to the database:
var db = new sqlite3.Database('./data/twitter.db');

//creates a tweet and adds it to the tweet DB
exports.createTweet = function(user, text, cb){
	if (text.length === 0){
		console.log('TEXT MUST BE ENTERED');
		cb('Please enter some text!');
	}
	else{

		var uid = user.uid;
		//enter series of functions to create tweet and return recent tid
		async.series([
            //insert user into DB
            function (callback){
              db.run("insert into tweets values (NULL, ?, ?, ?)", [uid, text, new Date()], function(error){
                if (error){
                  cb(error);
                }
                callback(null);
              });
            },
            
            //get recently added user to return to route handler    
            function(callback){
              db.get("select * from tweets where tid=(select MAX(tid) from tweets)", function(error, row){
              	if (error){
                  cb(error);
                }
                callback(null, row);
              });
            }
          ],

          //callback function: called after all above functions complete
          function callback(error, results){
            var tweet = results[1]; //tweet is object passed from 2nd series function
            if (error){
              cb(error);
            }
            else{
              cb(undefined, tweet);
            }
          }
          );
	}
};

//get all tweets posted by user
exports.getMyTweets = function(user, cb){
	db.all("select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid = ? ORDER BY t.time DESC", [user.uid], function(error, rows){
		if (error){
			cb(error);
		}
		else{
			var content = '<h3>Tweets</h3>';
			if (rows.length > 0){//there are tweets for this user: loop through query results and display
				content += '<ul id="profileTweets" class="tweets" style="list-style: none;">';
				for (var i=0; i<rows.length; i++){ 
            		var t = rows[i];
            		content += '<li id=' + '"' + i + '"' + '>';
            		var date = new Date(t.time);
            		//li.html('<span class="user"><a href="/user/' + that.posts[i].uname + '" style="text-decoration:none;">' + that.posts[i].uname + '</a></span>' + '</span><span class="date">' + date.toDateString() + '</span></br><span class="tweet clearfix">' + that.posts[i].tweet + '</span>' + '<a role="button" class="action-reply">Reply</a>');
            		content += '<span class="user"><a href="/user/' + t.uname + '" style="text-decoration:none;">' + t.uname + '</a></span>' + '</span><span class="date">' + date.toDateString() + '</span></br><span class="tweet clearfix">' + t.tweet + '</span>' + '<a role="button" class="action-reply">Reply</a>'
            		content += '</li>';
            	}
            	content += '</ul>';
            	cb(undefined, content);
			}
			else{
				//content is simply <h3>Tweets</h3>
          		cb(undefined, content);
			}
		}
	});
};

//get all tweets posted by user
/*exports.getMyTweets = function(user, cb){
	db.all("select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid = ? ORDER BY t.time DESC", [user.uid], function(error, rows){
		if (error){
			cb(error);
		}
		else{
			if (rows.length > 0){ //there are tweets to return
				cb(undefined, rows);
			}
			else{
				cb(undefined);
			}
		}
	});
};*/

//gets all tweets posted by user AND all of user's followers
exports.getAllTweets = function(user, cb){
	db.all("select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid = ? UNION select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid IN (select f.followid from follows f where f.uid = ?) ORDER BY t.time DESC",
		[user.uid, user.uid],
		function (error, rows){
			if (error){
				cb(error);
			}
			else{
				if (rows.length > 0){ //there are tweets to return
					cb(undefined, rows);
				}
				else{
					cb(undefined);
				}
			}
		});
};

//checks against last time!!
exports.getTweets = function(user, lastTime, cb){
	db.all("select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid = ? AND t.time >= ? UNION select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid IN (select f.followid from follows f where f.uid = ?) AND t.time >= ?",
		[user.uid, lastTime, user.uid, lastTime],
		function (error, rows){
			if (error){
				cb(error);
			}
			else{
				if (rows.length > 0){ //there are tweets to return
					cb(undefined, rows);
				}
				else{
					cb(undefined);
				}
			}
		});
};