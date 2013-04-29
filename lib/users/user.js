// # User Library
var sqlite3 = require('sqlite3');
var async   = require('async');

// Connect to the database:
var db = new sqlite3.Database('./data/twitter.db');

// Creates a user and adds it to the user db
exports.createUser = function(email1, email2, username, password, cb){
  if (email1.length === 0){ //check that email was entered
    cb('Please enter an email address.');
  }
  else if (email1 !== email2){ //check that emails match
    cb('Emails do not match.');
  }
  else if (username.length === 0){ //check that username was entered
    cb('Please enter a username.');
  }
  else if (password.length === 0){ //check that password was entered
    cb('Please enter a password.');
  }
  else{
    //check if requested username already exists in the DB
    db.get("select * from users where uname = ?", [username], function (error, row){
      if (error){
        cb(error);
      }
      else{
        if (row){ //username already exists
          var u = row.uname;
          cb('The username ' + u + ' is already in use. Please try again.');
        }
        else{ //username available, create new user

          //enter series of functions to create user and return to create session
          async.series([
            //insert user into DB
            function (callback){
              db.run("insert into users values (NULL, ?, ?, ?, ?)", [username, password, email1, 'admin'], function (error){
                if (error){
                  cb(error);
                }
                callback(null);
              });
            },

            //get recently added user to return to route handler
            function(callback){
              db.get("select * from users where uid=(select MAX(uid) from users)", function(error, row){
                if (error){
                  cb(error);
                }
                callback(null, row);
              });
            }
          ],

          //callback function: called after all above functions complete
          function callback(error, results){
            var user = results[1]; //user is object passed from 2nd series function
            if (error){
              cb(error);
            }
            else{
              cb(undefined, user);
            }
          }
          );

        }
      }
    });
  }
};



// Authorize user -- check if credentials are in the user DB
exports.auth = function(username, password, cb) {
  //check if username/password combination exists in the user DB
  db.get("select * from users where uname = ? AND password = ?", [username, password], function(error, row){
    if (error){
      cb(error);
    }
    else{
      if (row){ //authentication successful
        cb(undefined, row);
      }
      else{ //authentication failed
        cb('Incorrect username/password combination. Please try again.');
      }
    }
  });
};

// Looks up user in user db by username
exports.lookup = function(username, cb){
  //check if username exists in the user DB
  db.get("select * from users where uname = ?", [username], function(error, row){
    if (error){
      cb(error);
    }
    else{
      if (row){ //user found
        cb(undefined, row);
      }
      else{ //user not found
        cb('User ' + username + ' was not found.');
      }
    }
  });
};

// Follows user with ID followID
exports.follow = function(user, followID, cb){
  db.run("insert into follows values (?, ?, ?)", [user.uid, followID, new Date()], function(error){
    if (error){
      cb(error);
    }
    else{
      cb(undefined);
    }
  });
};

// Unfollows user with ID followID
exports.unfollow = function(user, followID ,cb){
  //delete connection in follows table
  db.run("delete from follows where uid = ? AND followid = ?", [user.uid, followID], function(error){
    if (error){
      console.log('DB Error: ' + error);
      cb(error);
    }
    else{
      cb(undefined);
    }
  });
};

// Lists suggestions of users to follow
// For now, just returns all users in userdb that the user is currently not following
exports.who_to_follow = function(user, cb){
  //get all users from user DB that the user passed in (session user) is not already following
  db.all("select * from users where uname != ? AND uid NOT IN (select followid from follows where uid = ?)", [user.uname, user.uid],
    function(error, rows){
      if (error){
        cb(error);
      }
      else{
        var content = '<h3>Who To Follow</h3>';
        if (rows.length > 0){//there are users to follow: loop through query results and display
          content += '<form name="follow" id="follow" method="post" action="/">';
          content += '<ul style="list-style-type: none; margin: 0px;">';
          for (var i=0; i<rows.length; i++){
            var u = rows[i];
            content += '<li><img src="/img/user_pics/' + u.uname + '.jpeg" onerror="this.src=' + "'/img/user_pics/default.jpeg'" + ';" width="32" height="32" class="left"/><a href="/user/' + u.uname + '" style="text-decoration:none;">&nbsp;' + u.uname + '</a>';
            //display with follow button that submits form
            content += '&nbsp;<button type="submit" form="follow" value="'+u.uid+'">Follow</button> </li>';
          }
          content += '</ul></form>';
          cb(undefined, content);
        }
        else{
          //content is simply <h3>Who To Follow</h3>
          cb(undefined, content);
        }
      }
    });
};

// Lists all of the users that the current user is following
exports.getFollowing = function(user, self, cb){
  //get all users from the user DB that the user passed in is currently following
  db.all("select uname, uid from users where uid IN (select followid from follows where uid = ?)",
    [user.uid],
    function(error, rows){
      if (error){
        cb(error);
      }
      else{
        var content = '<h3>Following</h3>';
        if (rows.length > 0){ //this user is following other users: loop through query results and display
          content += '<form name="unfollow" id="unfollow" method="post" action="/">';
          content += '<ul style="list-style-type: none; margin: 0px;">';
          for (var i=0; i<rows.length; i++){
            var u = rows[i];
            content += '<li><img src="/img/user_pics/' + u.uname + '.jpeg" onerror="this.src=' + "'/img/user_pics/default.jpeg'" + ';" width="32" height="32" class="left"/><a href="/user/' + u.uname + '" style="text-decoration:none;">&nbsp;' + u.uname + '</a>';
            if (self === true){ //only display unfollow button if user is viewing own profile
              content += '&nbsp;<button type="submit" form="unfollow" value="'+u.uid+'">Following</button> </li>';
            }
          }
          content += '</ul></form>';
          cb(undefined, content);
        }
        else{
          //content is simply <h3>Following</h3>
          cb(undefined, content);
        }
      }
    });
};

// Lists all of the users that follow the user passed in
exports.getFollowers = function(user, self, cb){
  //get all users from the user DB that follow the user passed in
  db.all("select uname, uid from users where uid IN (select uid from follows where followid = ?)",
    [user.uid],
    function(error, rows){
      if (error){
        cb(error);
      }
      else{
        var content = '<h3>Followers</h3>';
        if (rows.length > 0){
          content += '<ul style="list-style-type: none; margin: 0px;">';
          for (var i=0; i<rows.length; i++){
            var u = rows[i];

            //check whether or not the user passed in (user) follows the current user (u)
            db.get("select uid from follows where uid = ? and followid = ?", [user.uid, u.uid], function(error, row){
              if (error){
                cb(error);
              }
              else{
                if (row){ //the user passed in is following the current user: display unfollow button
                  content += '<form name="unfollow" id="unfollow" method="post" action="/">';
                  content += '<li><img src="/img/user_pics/' + u.uname + '.jpeg" onerror="this.src=' + "'/img/user_pics/default.jpeg'" + ';" width="32" height="32" class="left"/><a href="/user/' + u.uname + '" style="text-decoration:none;">&nbsp;' + u.uname + '</a>';
                  content += '&nbsp;<button type="submit" form="unfollow" value="'+u.uid+'">Following</button> </li>';
                  content += '</form></ul>';
                }
                else{ //the user passed in is not following the current user: display follow button
                  content += '<form name="follow" id="follow" method="post" action="/">';
                  content += '<li><img src="/img/user_pics/' + u.uname + '.jpeg" onerror="this.src=' + "'/img/user_pics/default.jpeg'" + ';" width="32" height="32" class="left"/><a href="/user/' + u.uname + '" style="text-decoration:none;">&nbsp;' + u.uname + '</a>';
                  content += '&nbsp;<button type="submit" form="follow" value="'+u.uid+'">Follow</button> </li>';
                  content += '</form></ul>';
                }
                cb(undefined, content);
              }
            });
          }
        }

        else{
          //content is simply <h3>Followers</h3>
          cb(undefined, content);
        }
      }
    });
};

// Get the number of users that the user passed in is following
exports.getNumFollowing = function(user, cb){
  db.get("select COUNT(*) AS count from follows where uid = ?", [user.uid], function(error, row){
    if (error){
      cb(error);
    }
    else{
      if (row){
        cb(undefined, row.count);
      }
      else{
        cb(undefined, 0);
      }
    }
  });
};

// Get the number of users that are following the user passed in
exports.getNumFollowers = function(user, cb){
  db.get("select COUNT(*) AS count from follows where followid = ?", [user.uid], function(error, row){
    if (error){
      cb(error);
    }
    else{
      if (row){
        cb(undefined, row.count);
      }
      else{
        cb(undefined, 0);
      }
    }
  });
};


//get follow/unfollow button to be displayed on a user's profile page
exports.followButton = function(user, followUser, cb){
  var me = user.uid;
  var follow = followUser.uid;
  var button = undefined;
  //check DB to see if session user follows the user in question
  db.get("select * from follows where uid = ? AND followid = ?", [me, follow], function(error, row){
    if (error){
      cb(error);
    }
    else{
      if (row){ //already following this user --> display "Unfollow" button
        console.log(user.uname + ' already following ' + followUser.uname);
        button = '<form name="unfollow" id="unfollow" method="post" action="/">';
        button += '<button type="submit" class="hover" form="unfollow" value="'+follow+'">Following</button></form>';
      }
      else{ //not following this user, display "Follow" button
        console.log(user.uname + '  NOT following ' + followUser.uname);
        button = '<form name="follow" id="follow" method="post" action="/">';
        button += '<button type="submit" class="hover" form="follow" value="'+follow+'">Follow</button></form>';
      }
      cb(undefined, button);
    }
  });
};
