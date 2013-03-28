// # User Library

// ## User Objects
function User(email, username, password, uid) {
  this.email = email;
  this.username = username;
  this.password = password;
  // Added uid
  this.uid      = uid;
}

// This is our stub database until we look at a real database!
var userdb = [
  new User('test@test.com', 'jeff',   'jeff', 1),
  new User('test@test.com', 'marco', 'marco', 2),
  new User('test@test.com', 'matt', 'matt', 3),
  new User('test@test.com', 'jon', 'jon', 4)
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

exports.createUser = function(email, username, password, cb){
	var uid = userdb[userdb.length-1].uid ++;
	console.log(uid);
	var user = new User(email, username, password, uid);
	userdb.push(user);
};

/*exports.getUser = function(username){
	var u = undefined;
	for (var i=0; i<userdb.length; i++){
		if (userdb[i].username == username){
			u = userdb[i];
			break;
		}
	}
	if (u === undefined){
		return "Cannot find user " + username;
	}
	return u;
*/