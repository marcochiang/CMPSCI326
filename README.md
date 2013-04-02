# CMPSCI326: Team Killington
=============================
Authors:
>Marco Chiang
>Matt Rheault
>Jonathan Godin
>Jeff Pezzone

## How to Run
You can run our app using `node app.js` from the top level directory.

## Project Assignment 03
Here is a list of the files and additions we made:
* app.js:
 	- added new routes to include tweeting functionality (uses ajax to post tweets and pull them).
 	- added login and register routes
 	- added follow_user routes to temporarily allow hardcoded following functionality
* routes/tweet.js:
	- added a new route file to allow posting and checking of tweets using ajax
* js/main.js:
	- added and modified jquery and javascript code to enhance the tweeting features. It now allows submitting tweets and using ajax to poll the tweeted messages to show up in the tweet section.
* views/users/login.ejs & register.ejs & who_to_follow.ejs & showUser.ejs & usersList.ejs:
	- added views so users can now register and login. Also included who to follow and showing a list of users available.