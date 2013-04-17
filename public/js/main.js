/*
	=========================
		Gets username
	=========================
*/
var test = document.getElementById("newTweet");
var username = test.name;

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






/*
	=========================
			Home Page
	=========================
	*/

// Start by hiding the tweet button and count until form box is opened
$('span#char_count').hide();
$('input.tweetButton').hide();

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
});

// Follow button clicked --> change action of form
$('form#follow .hover').click(function(event)
{
	var followID = $(this).val();
	$('form#follow').attr("action", "/follow/" + followID);
	$(this).text("Following");
});

// Unfollow button clicked --> change action of form
$('form#unfollow .hover').click(function(event)
{
	var followID = $(this).val();
	//alert(followID);
	$('form#unfollow').attr("action", "/unfollow/" + followID);
	//$(this).text("Following");
});

// Hover event on Unfollow button
$('form#unfollow .hover').hover(
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
			console.log('Check rcvd: ' + JSON.stringify(data));

			// Append the posts to the current posts:
			that.posts = that.posts.concat(data);

			// Rewrite to the view:
			that.view.empty();
			for (var i = 0; i < that.posts.length; i++) {
				var li   = $('<li>');
				var date = new Date(that.posts[i].date);
				li.html(username + ': ' + '<span class="tweet">' + that.posts[i].text + '</span><br /><span class="date">' + date.toDateString() + '</span>');
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
	var chatc = new ChatClient({ view : $('ul#tweets') });

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
		$('span#char_count').hide();
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


