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

$('input.tweetButton').hide();


$('textarea.tweetExpand').focus(function () {
	$(this).animate({ height: "100px" }, 0);
	$('input.tweetButton').show();
	$('input.tweetButton').hover(function () {
		$(this).attr("src","/img/Tweet_Focus_In.jpg");
	}, function() {
		$(this).attr("src","/img/Tweet_Focus_Out.jpg");
	});
});

$('textarea.tweetExpand').focusout(function () {
	$(this).animate({ height: "16px" }, 0);
	$('input.tweetButton').hide();
});
