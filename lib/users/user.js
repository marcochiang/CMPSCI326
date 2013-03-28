// # User Library

// ## User Objects
function User(email, username, password, role, uid) {
  this.email = email;
  this.username = username;
  this.password = password;
  this.role = role;
  this.uid      = uid;
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

exports.createUser = function(email, username, password, role, cb){
	var uid = userdb[userdb.length-1].uid ++;
	console.log(uid);
	var user = new User(email, username, password, role, uid);
	userdb.push(user);
};