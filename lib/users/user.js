// # User Library
var sqlite3 = require('sqlite3');
var async   = require('async');

// Connect to the database:
var db = new sqlite3.Database('./data/twitter.db');

// Array Remove - By John Resig (MIT Licensed)
Array.prototype.removeElement = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// ## User Objects
function User(email, username, password, role, uid) {
  this.email = email;
  this.username = username;
  this.password = password;
  this.role = role;
  this.uid = uid;
  this.followList = new Array();
}


// This is our stub database until we look at a real database!
var userdb = [
  new User('test@test.com', 'jeff',   'jeff', 'admin', 1),
  new User('test@test.com', 'marco', 'marco', 'admin', 2),
  new User('test@test.com', 'matt', 'matt', 'admin', 3),
  new User('test@test.com', 'jon', 'jon', 'admin', 4)
];


// Export the `users` list.
exports.users = userdb;

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

// Returns a list of all the users in the userdb
exports.list = function(){
  var len = userdb.length;
  var content = '<h3>Users</h3>';
  content += '<ul style="list-style-type: none; padding:0px; margin:0px;">';
  for (var i = 0; i < len; i++) {
    var u = userdb[i];
    content += '<li><b>Username:</b> ' + u.username + ', <b>Password:</b> ' + u.password +
    ', <b>Email:</b>' + u.email + ', <b>id: </b>' + u.uid +'</li>';
  }
  content += '</ul>';
  return content;
};

// Follows user with ID followID
exports.follow = function(user, followID, cb){
  /*var me = userdb[user.uid-1];
  var follow = userdb[followID-1];
  me.followList.push(follow.uid);//add to my followList
  cb(undefined);//possible errors?*/
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
  var me = userdb[user.uid-1];
  var follow = userdb[followID-1];
  var remove = undefined;
  for (var i=0; i < me.followList.length; i++){ //loop through followList
    if (me.followList[i] == followID){ //found user
      remove = i;
      break;
    }
  }
  if (remove === undefined){
    cb('cannot find user');
  }
  else{
    me.followList.removeElement(remove); //remove userID from followList
    cb(undefined);
  }
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
        if (rows){//there are users to follow: get them and display
          var content = '<form name="follow" id="follow" method="post" action="/">';
          content += '<h3>Who To Follow</h3><ul style="list-style-type: none; margin: 0px;">';
          for (var i=0; i<rows.length; i++){ //loop through returned users, display with follow button that submits a form
            var u = rows[i];
            content += '<li><a href="/user/' + u.uname + '" style="text-decoration:none;"> ' + u.uname + ' </a>';
            content += '&nbsp;<button type="submit" form="follow" value="'+u.uid+'">Follow</button> </li>';
          }
          content += '</ul></form>';
          cb(undefined, content);
        }
        else{
          cb('There are no more users for you to follow!');
        }
      }
    });

};

// Lists all of the users that the current user is following
exports.getFollowing = function(user, button){
  /*var me = userdb[user.uid-1];
  var content = '<form name="unfollow" id="unfollow" method="post" action="/">';
  content += '<h3>Following</h3><ul style="list-style-type: none; margin: 0px;">';
  for (var i=0; i < me.followList.length; i++){
    var id = me.followList[i];
    var u = userdb[id-1];
    content += '<li><a href="/user/' + u.username + '" style="text-decoration:none;"> ' + u.username + ' </a>';
    if (button){ //only display button if viewing your own profile
      content += '&nbsp;<button type="submit" form="unfollow" value="'+u.uid+'">Following</button> </li>';
    }

  }
  content += '<ul></form>';
  return content;*/


};

//get follow/unfollow button to be displayed on a user's profile page
exports.followButton = function(user, followUser, cb){
  /*var me = userdb[user.uid-1];
  var u = undefined;
  for (var i=0; i < userdb.length; i++){
    if (userdb[i].username === followUser){ //found user in user db
      u = userdb[i];
      break;
    }
  }
  if (u){
    var following = false;
    for (var j=0; j < me.followList.length; j++){ //loop through my followList
      if (me.followList[j] === u.uid){ //already following this user
        following = true;
        break;
      }
    }
    var button = undefined;
    if (following){ //if already following, display "Unfollow" button
      button = '<form name="unfollow" id="unfollow" method="post" action="/">';
      button += '<button type="submit" class="hover" form="unfollow" value="'+u.uid+'">Following</button></form>';
    }
    else{ //if not following, display "Follow" button
      button = '<form name="follow" id="follow" method="post" action="/">';
      button += '<button type="submit" class="hover" form="follow" value="'+u.uid+'">Follow</button></form>';
    }
    cb(undefined, button);
  }
  else{ //didn't find user --> error
    cb('user not found');
  }*/

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
