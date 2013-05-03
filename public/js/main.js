/*
	=========================
		Gets username
	=========================
	*/

	var test = document.getElementById("newTweet");
	var username = test.name;
	var tweet_count = 0;

/*
	=========================
		Character Count
	=========================
	*/

	function countChars(textbox, counter, max, tweetButton) {
		var count;
		if($('textarea.tweetExpand').text() === 'Compose a new tweet...'){
			document.getElementById(counter).innerHTML = 140;
		}
		else{
			count = max - document.getElementById(textbox).value.length;
			if (count < 0)
			{
				$('input.tweetButton').attr("src","/img/Tweet_Disabled.jpg");
				document.getElementById('tweetButton').disabled = true;
				document.getElementById(counter).innerHTML = "<span style=\"color: red;\">" + count + "</span>";
			}
			else
			{
				$('input.tweetButton').attr("src","/img/Tweet_Focus_Out.jpg");
				document.getElementById('tweetButton').disabled = false;
				document.getElementById(counter).innerHTML = count;
			}
		}
	}


	function tweetReply(name, id){
		$('textarea.tweetExpand').focus();
		$('textarea.tweetExpand').val('@'+ name + ' ');
	}

/*
	=========================
			Home Page
	=========================
	*/



// Start by hiding the tweet button and count until form box is opened
$('span#char_count').hide();
$('input.tweetButton').hide();
$('img.tweet_posted').hide();


// Expands the form box when focused on and adds hover over feature when going over tweet button
$('textarea.tweetExpand').focus(function () {
	document.getElementById('tweetButton').disabled = false;
	$('input.tweetButton').attr("src","/img/Tweet_Focus_Out.jpg");
	//if($(this).text() === 'Compose a new tweet...') {
		$(this).val("");
	//}
	$(this).animate({ height: "100px" }, 0);
	$('span#char_count').show();
	$('input.tweetButton').show();
	$('input.tweetButton').hover(function () {
		$(this).attr("src","/img/Tweet_Focus_In.jpg");
	}, function() {
		$(this).attr("src","/img/Tweet_Focus_Out.jpg");
	});
});

//console.log($('textarea.tweetExpand').value);
//if($('textarea').value == 'Compose a new tweet...' || $('textarea').value == ''){
/*	$('form#tweet').focusout(function () {
		$('input.tweetButton').hide();
		$('textarea.tweetExpand').animate({ height: "16px" }, 0);
	});*/

// Prevents the tweet form from posting
$('form#tweet').click(function(event)
{
	event.preventDefault();
	/*var tweet = $('<div id="tweet" class="center"> \
		<img src="http://localhost:3000/img/" /> \
		</div>');*/
	var tweet = $('<div id="tweet" class="center"> \
		\
		</div>');
});


/*
	=========================
	    Follow/Unfollow
	=========================
	*/

//handler for cick event on "Follow" button
function followHandler(event){
	event.preventDefault(); //prevent normal form submission

	var button = $(this); //follow button
	var buttonID = button.attr("id"); //this ID determines where follow button was clicked
	var followID = button.val();
	var form = button.parents("form"); 

	//AJAX request to enter follows mapping in DB
	var req = $.ajax({
		type : 'POST',
		url  : '/follow/'+followID,
		data : {page: window.location.pathname},
		dataType : 'json'
	});
	req.done(function(data){
		//change form from follow to unfollow -- don't necessarily need to do this in order for everything to work
		form.attr("name", "unfollow");
		form.attr("id", "unfollow");

		button.text("Following");
		//button hover property
		button.on("mouseenter", function(event){
			button.text("Unfollow");
		});

		button.on("mouseleave", function(event){
			button.text("Following");
		});

		//button now references unfollow form -- don't necessarily need to do this in order for everything to work
		button.attr("form", "unfollow");
		button.off("click"); //turn off original click event
		button.click(unfollowHandler); //now, button click should unfollow instead of follow

		//update profileSidebar by incrementing number of users following
		var profFollowing = parseInt($('span#sideNumFollowing').html());
		$('span#sideNumFollowing').html(profFollowing+1);

		//follow button was clicked on user's profile page
		if (buttonID == "profileFollow"){
			button.attr("id", "profileUnfollow"); //switch ID
			var old = parseInt($('span#numFollowers').html());
			$('span#numFollowers').html(old+1);
		}
		else{
			//follow button was clicked on user's who_to_follow page
			if (data.page == 'who_to_follow'){
				//remove username from the list
				$('li#'+followID).remove();
			}
			//follow button was clicked on user's followers page
			else if (data.page === 'followers'){
				//if on your own profile page, update your profile stats by incrementing number following
				if (data.self ==  true){
					var old = parseInt($('span#numFollowing').html());
					$('span#numFollowing').html(old+1);
				}
			}
		}
	});
}

$('form#follow button').on("click", followHandler);

//handler for cick event on "Unfollow" button
function unfollowHandler(event){
	event.preventDefault(); //prevent normal form submission

	var button = $(this); //unfollow button
	var buttonID = button.attr("id");
	var followID = button.val();
	var form = button.parents("form"); 

	//AJAX request to remove follows mapping in DB
	var req = $.ajax({
		type : 'POST',
		url  : '/unfollow/'+followID,
		data : {page: window.location.pathname},
		dataType : 'json'
	});
	req.done(function(data){
		//change form from unfollow to follow -- don't necessarily need to do this in order for everything to work
		form.attr("name", "follow");
		form.attr("id", "follow");

		button.off("mouseenter");
		button.off("mouseleave");
		button.text("Follow");

		//button now references follow form -- don't necessarily need to do this in order for everything to work
		button.attr("form", "follow"); 
		button.off("click"); //turn off original click event
		button.click(followHandler); //now, button click should follow instead of unfollow

		//update profileSidebar by decrementing total number of users following
		var profFollowing = parseInt($('span#sideNumFollowing').html());
		$('span#sideNumFollowing').html(profFollowing-1);

		//unfollow button was clicked on user's profile page
		if (buttonID == "profileUnfollow"){
			button.attr("id", "profileFollow"); //switch ID
			var old = parseInt($('span#numFollowers').html());
			$('span#numFollowers').html(old-1);
		}
		else{
			//unfollow button was clicked on user's followers page
			if (data.page === 'followers'){
				//if on your own profile page, update your profile stats by decrementing number following
				if (data.self ==  true){
					var old = parseInt($('span#numFollowing').html());
					$('span#numFollowing').html(old-1);
				}
			}
			else if (data.page === 'following'){
				//if on your own profile page, update your profile stats by decrementing number following
				if (data.self ==  true){
					var old = parseInt($('span#numFollowing').html());
					$('span#numFollowing').html(old-1);
					$('li#'+followID).remove();
				}
			}
		}
	});
}

$('form#unfollow button').on("click", unfollowHandler);

// Hover event on Unfollow button
$('form#unfollow button').on("mouseenter", function(event){
	$(this).text("Unfollow");
});

$('form#unfollow button').on("mouseleave", function(event){
	$(this).text("Following");
});

/*

	A ChatClient object for communicating
	with the chat server.

	*/
	function ChatClient(config) {
		for (var prop in config) {
			this[prop] = config[prop];
		}
	}

	ChatClient.prototype = {
	// An cache of posts received from server.
	posts : [],

	// Start polling the server.
	poll : function () {
		var that = this;
		this._stop = setInterval(function () {
			that.check();
		},
		3000);
	},

	// Stop polling this server.
	pollStop : function () {
		clearInterval(this._stop);
	},

	// Post text to the server.
	post : function (text) {
		$.ajax({
			type : 'POST',
			url  : '/post',
			data : { 'text' : text },
			dataType : 'json'
		}).done(function (data) {
			console.log('Post status: ' + data.status);
		});
	},

	// Check for more messages on the server
	// given the last index we have for the
	// current posts.
	check : function () {
		var that = this;
		$.ajax({
			type : 'POST',
			url  : '/check',
			data : { last : that.posts.length },
			dataType : 'json'
		}).done(function (data) {
			if (data != ""){
				that.posts = data;

				// Rewrite to the view:
				that.view.empty();
				for (var i=0; i<that.posts.length; i++){
					var li   = $('<li id=' + '"' + i + '"' + '>');
					var date = new Date(that.posts[i].time);
					//li.html('<span class="user"><a href="/user/' + that.posts[i].uname + '" style="text-decoration:none;">' + that.posts[i].uname + '</a></span>' + '</span><span class="date">' + date.toDateString() + '</span></br><span class="tweet clearfix">' + that.posts[i].tweet + '</span>' + '<a role="button" class="action-reply">Reply</a>');
					li.html('<span class="user"><a href="/user/' + that.posts[i].uname + '" style="text-decoration:none;">' + that.posts[i].uname + '</a></span><span class="date">' + date.toDateString() + '</span></br><span class="tweet clearfix">' + that.posts[i].tweet + '</span>' + '<a onclick="tweetReply(this. name, this.id)" role="button" name="' + that.posts[i].uname + '" class="action-reply"' + 'id=' + '"' + i + '"' + '>Reply</a>');
					that.view.append(li);
				}
				tweet_count = that.posts.length
				//$('.action-reply').hide();
			}
		});
	}
};


function PostButton(config) {
	for (var prop in config) {
		this[prop] = config[prop];
	}
}

PostButton.prototype = {
	bind : function (type, cb) {
		var that = this;
		this.view.bind(type, function (event) {
			cb.call(that, event);
		});
	}};

//load data into profileSidebar
function loadProfileSideStats(){
	$.ajax({
		type : 'POST',
		url  : '/loadProfile',
		//data : { last : that.posts.length },
		dataType : 'json'
	}).done(function (data) {
		var numFollowing = data.numFollowing;
		var numFollowers = data.numFollowers;
		var numTweets = data.numTweets;
		var username = data.username;

		var tweetLI = $('<li>');
		tweetLI.append('<a href="/user/' + username + '"><span id="sideNumTweets">' + numTweets + '</span><br /><span class="msg">Tweets</span></a>');
		$('ul#profileSidebar').append(tweetLI);

		var followingLI = $('<li>');
		followingLI.append('<a href="/user/' + username + '/following"><span id="sideNumFollowing">' + numFollowing + '</span><br /><span class="msg">Following</span></a>');
		$('ul#profileSidebar').append(followingLI);

		var followersLI = $('<li>');
		followersLI.append('<a href="/user/' + username + '/followers"><span id="sideNumFollowers">' + numFollowers + '</span><br /><span class="msg">Followers</span></a>');
		$('ul#profileSidebar').append(followersLI);
	});
}

// jQuery ready handler:
$(document).ready(function() {

	// Tipsy Class Definition
	$('.north').tipsy({gravity: 'n'});
	$('.south').tipsy({gravity: 's'});
	$('.east').tipsy({gravity: 'e'});
	$('.west').tipsy({gravity: 'w'});

	// PrettyPhoto Call
	$("a[rel^='prettyPhoto']").prettyPhoto();

	$("li.session").click(function() {
		$(this).toggleClass('active');
	});

	$('li.session').bind('clickoutside', function (event) {
		$('li.session').removeClass('active');
	});

	//check for existence of <ul> in profileSidebar --> if so, load it with number of tweets, followers, following..
	if ($('ul#profileSidebar').length > 0){
		loadProfileSideStats();
	}

	// Get the list view that the chat client
	// will populate with incoming messages:
	//for the tweets on a users home page!!
	var chatc = new ChatClient({ view : $('ul#tweets') });

	//only poll the server if we are on the home page (where the element $('ul#tweets') resides)
	if ($('ul#tweets').length > 0){
		// Check for tweets first so they load immediately
		chatc.check();
		// Start polling:
		chatc.poll();
	}

	// Setup the post button:
	var postb = new PostButton({
		view  : $('input.tweetButton'),
		input : $('textarea.tweetExpand')
	});

	// Bind a click event:
	postb.bind('click', function (event) {
		console.log(this);
		var text = this.input.val();
		chatc.post(text);
		// clear input text:
		this.input.val('Compose a new tweet...');
		$('span#char_count').hide();
		$('input.tweetButton').hide();
		$('textarea.tweetExpand').animate({ height: "16px" }, 0);
		$('.tweet_posted').show();
		setTimeout(function(){
			$('.tweet_posted').fadeOut(500);
		},1000);
		return false;
	});
});
