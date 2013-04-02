/*$('#glance #newTweet').focus(function () {
    $(this).animate({ height: "100px" }, 500);
	if($(this).text() === 'Compose a new tweet...') {
		$(this).text('');
	}
});

$('#glance #newTweet').focusout(function () {
	if($(this).text() === 'Compose a new tweet...') {
		$(this).animate({ height: "16px" }, 500);
	}
	else if($(this).text() === '') {
		$(this).animate({ height: "16px" }, 500);
		$(this).text('Compose a new tweet...');
	}
});*/

/*
	Home Page
	*/

// Start by hiding the tweet button until form box is opened
$('input.tweetButton').hide();

// Expands the form box when focused on and adds hover over feature when going over tweet button
$('textarea.tweetExpand').focus(function () {
	$(this).animate({ height: "100px" }, 0);
	$('input.tweetButton').show();
	$('input.tweetButton').hover(function () {
		$(this).attr("src","/img/Tweet_Focus_In.jpg");
	}, function() {
		$(this).attr("src","/img/Tweet_Focus_Out.jpg");
	});
});

// 
$('textarea.tweetExpand').focusout(function () {
	//$('input.tweetButton').hide();
	//$('textarea.tweetExpand').animate({ height: "16px" }, 0);
});

// Prevents the tweet form from posting
$('form#tweet').click(function(event)
{
	event.preventDefault();
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
			console.log('Check rcvd: ' + JSON.stringify(data));

			// Append the posts to the current posts:
			that.posts = that.posts.concat(data);

			// Rewrite to the view:
			that.view.empty();
			for (var i = 0; i < that.posts.length; i++) {
				var li   = $('<li>');
				var date = new Date(that.posts[i].date);
				li.html(date.toDateString() + ': ' + that.posts[i].text);
				that.view.append(li);
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
$(function () {
	// Get the list view that the chat client
	// will populate with incoming messages:	
	var chatc = new ChatClient({ view : $('ul#tweet') });

	// Start polling:
	chatc.poll();

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
		$('input.tweetButton').hide();
		$('textarea.tweetExpand').animate({ height: "16px" }, 0);
		alert('Tweet successfully posted');
		return false;
	});

});


/*// Get tweet button to display stuff
var input = document.getElementById('newTweet'),
    placeholder = document.getElementById('tweetMSG');

input.onkeyup = function() {
   placeholder.innerHTML = input.value
}*/

