// # User Library
//var LinkedList = require('linkedlist');

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
  //this.followList = new LinkedList();
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
  var uid = userdb[userdb.length-1].uid + 1; //increment uid
  if (email1.length === 0){ //check that email was entered
    cb('please enter an email address');
  }
  else if (email2.length === 0){ //check that email was verified
    cb('please verify your email address');
  }
  else if (username.length === 0){ //check that username was entered
    cb('please enter a username');
  }
  else if (password.length === 0){ //check that password was entered
    cb('please enter a password');
  }
  else if (email1 !== email2){ //check that emails match
    cb('emails do not match');
  }
  else{
    var len = userdb.length;
    for (var i = 0; i < len; i++) { //loop through userdb, make sure username not taken already
      var u = userdb[i];
      if (u.username === username){
        cb('username ' + username + ' is already in use');
        return;
      }
    }

    //create new user, add to user db
    var newUser = new User(email1, username, password, 'admin', uid);
    userdb.push(newUser);
    cb(undefined, newUser);
  }
};

// Authorize user -- check if credentials are in the user db
exports.auth = function(username, password, cb) {
  var len = userdb.length;
  for (var i = 0; i < len; i++) {
    var u = userdb[i];
    if (u.username === username) {
      if (u.password === password) {
        cb(undefined, u);
      }
      else {
        cb('password is not correct');
      }
      return;
    }
  }
  cb('user not found');
};

// Looks up user in user db by username
exports.lookup = function(username, cb){
  var len = userdb.length;
  var u = undefined;
  for (var i = 0; i < len; i++) {
    if (userdb[i].username === username){ //found user
      u = userdb[i];
      cb(undefined, u);
      return;
    }
  }
  cb('user not found')
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

// Adds the followUID User to your following list -- Jon's old code
/*exports.follow = function(myUID, followUID, cb){
  if(userdb[myUID] === userdb[followUID]) {
    return "You cannot follow yourself";
  }
  var me = userdb[myUID-1];
  var following = userdb[followUID-1];

  while (me.followList.next()) {
    var id = me.followList.current;
    var u = userdb[id-1];
    if(id.toString() === followUID.toString()) {
      return "Already following " + u.username;
    }
  }
  me.followList.resetCursor();

  me.followList.push(following.uid.toString());

  return 'Successfully following: ' + following.username;
}*/

// Follows user with ID followID
exports.follow = function(user, followID, cb){
  var me = userdb[user.uid-1];
  var follow = userdb[followID-1];
  me.followList.push(follow.uid);//add to my followList
  cb(undefined);//possible errors?
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
exports.who_to_follow = function(user){
  var me = userdb[user.uid-1];
  var len = userdb.length;
  var followSuggestions = [];
  for (var i=0; i < len; i++){ //loop through all users in the user db
    var u = userdb[i];
    var alreadyFollowed = false;
    if (u.username !== me.username){ //can't follow yourself
      for (var j=0; j < me.followList.length; j++){ //loop through current user's follow list
        var id = me.followList[j];
        if (u.uid === id){ //don't add to follow list if user is already being followed
          alreadyFollowed = true;
          break;
        }
      }
      if (!alreadyFollowed){
        followSuggestions.push({id: u.uid, username: u.username});
      }
    }
  }
  var content = '<form name="follow" id="follow" method="post" action="/">';
  content += '<h3>Who To Follow</h3><ul style="list-style-type: none; margin: 0px;">';
  for (var k=0; k < followSuggestions.length; k++){
    var f = followSuggestions[k];
    //content += '<li><a href="/follow_user/' + f.id + '"> ' + f.username + ' </a></li>';
    content += '<li><a href="/user/' + f.username + '" style="text-decoration:none;"> ' + f.username + ' </a>';
    content += '&nbsp;<button type="submit" form="follow" value="'+f.id+'">Follow</button> </li>';
  }
  content += '</ul></form>';
  return content;
};

// Lists all of the users that the current user is following
exports.getFollowing = function(user, button){
  var me = userdb[user.uid-1];
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
  return content;
};

// Lists all of the people you are following -- Jon's old code
/*exports.listFollowing = function(myUID, cb){
  var me = userdb[myUID-1];
  var content = '<h3>Following List</h3>';
  content += '<ul style="list-style-type: none; padding:0px; margin:0px;">';
  while (me.followList.next()) {
    var u = userdb[me.followList.current-1];
    content += '<li><b>Username:</b> ' + u.username + ', <b>id: </b>' + u.uid +'</li>';
  }
  content += '</ul>';
  me.followList.resetCursor();
  return content;
}*/

//get follow/unfollow button to be displayed on a user's profile page
exports.profileButton = function(user, followUser, cb){
  var me = userdb[user.uid-1];
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
  }
};
