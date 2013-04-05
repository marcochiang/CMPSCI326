# CMPSCI326: Team Killington
=============================
Authors:
>Marco Chiang - 
>Matt Rheault - 
>Jonathan Godin - 
>Jeff Pezzone - 

## How to Run
You can run our app using `node app.js` from the top level directory.

## Project Assignment 03
Here is a list of the files and additions we made:
* app.js:
 	- added new routes to include tweeting functionality (uses ajax to post tweets and pull them).
 	- added routes for login and register functionality
 	- added routes for following/unfollowing functionality
 	- major changes to URL mappings for user's profiles caused many routes to be added as well. Each user gets mapped to a URL like "localhost:3000/user/jeff". These new URL mappings mimic the real Twitter almost exactly.
* routes/tweet.js:
	- added a new route file to allow posting and checking of tweets using ajax
* js/main.js:
	- added and modified jquery and javascript code to enhance the tweeting features. It now allows submitting tweets and using ajax to poll the tweeted messages to show up in the tweet section.
	- added code for following/unfollowing functionality
* views/users/login.ejs & register.ejs & who_to_follow.ejs & showUser.ejs & usersList.ejs:
	- added views so users can now register and login. Also included who to follow and showing a list of users available.
* README.md:
	- added documentation of things we changed.
	- added a pdf file called colorfeature located in public/files which is the new functional spec for the new feature we plan to implement later.
* routes/user.js
	- Routes added for login and register functionality. 
	- Many routes updated to deal with session support.
	- Route logic also changed with new URL mappings, as well as the following/unfollowing functionality.
* lib/users/user.js
	- Lots of functions added in the user lib directory to support creating new users, looking them up in the fake user db, authorizing them, etc.
	- New functions were also added to support the following/unfollowing functionality.


Please note that some old/out-of-place code that will eventually be changed has been left in for this assignment.