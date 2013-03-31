// # User Library
var LinkedList = require('LinkedList');

// ## User Objects
function User(email, username, password, role, uid) {
  this.email = email;
  this.username = username;
  this.password = password;
  this.role = role;
  this.uid = uid;
  this.followList = new LinkedList();
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

// Looks up a user in the user db
exports.lookup = function(username, password, cb) {
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

// Adds the followUID User to your following list
exports.follow = function(myUID, followUID, cb){
  if(userdb[myUID] === userdb[followUID]) {
    cb('You cannot follow yourself');
    return;
  }
  var me = userdb[myUID-1];
  var following = userdb[followUID-1];

  me.followList.push(following.uid.toString());

  return 'Successfully following: ' + following.username;
}

// Lists all of the people you are following
exports.listFollowing = function(myUID, cb){
  var me = userdb[myUID-1];
  var content = '<h3>Following List</h3>';
  content += '<ul style="list-style-type: none; padding:0px; margin:0px;">';
  while (me.followList.next()) {
    var u = userdb[me.followList.pop()-1];
    content += '<li><b>Username:</b> ' + u.username + ', <b>id: </b>' + u.uid +'</li>';
  }
  content += '</ul>';
  return content;
}

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
