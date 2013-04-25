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


// Follow button clicked --> change action of form
$('form#follow button').click(function(event)
{
	var followID = $(this).val();
	$('form#follow').attr("action", "/follow/" + followID);
	$(this).text("Following");
});

// Unfollow button clicked --> change action of form
$('form#unfollow button').click(function(event)
{
	var followID = $(this).val();
	//alert(followID);
	$('form#unfollow').attr("action", "/unfollow/" + followID);
	//$(this).text("Following");
});

// Hover event on Unfollow button
$('form#unfollow button').hover(
	function(event)
	{
		$(this).text("Unfollow");
	},
	function(event)
	{
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
