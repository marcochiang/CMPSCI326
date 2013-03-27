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

// On focus out, collapse the form and hide the tweet button
$('textarea.tweetExpand').focusout(function () {
	$(this).animate({ height: "16px" }, 0);
	$('input.tweetButton').hide();
});


// Get tweet button to display stuff
var input = document.getElementById('newTweet'),
    placeholder = document.getElementById('tweetMSG');

input.onkeyup = function() {
   placeholder.innerHTML = input.value
}


