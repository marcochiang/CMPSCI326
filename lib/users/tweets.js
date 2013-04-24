// # Tweet Library
var sqlite3 = require('sqlite3');
var async   = require('async');

// Connect to the database:
var db = new sqlite3.Database('./data/twitter.db');

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

exports.getAllTweets = function(user, cb){
	db.all("select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid = ? UNION select t.*, u.uname AS uname from tweets t, users u where t.uid = u.uid AND t.uid IN (select f.followid from follows f where f.uid = ?)",
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