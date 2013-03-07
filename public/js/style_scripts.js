
//Tweet box and button animation
$('button.show_hide').hide();

$('textarea.expand').focus(function () {
    $(this).animate({ height: "6em" }, 500);
    $('button.show_hide').show();
});

$('textarea.expand').focusout(function () {
    $(this).animate({ height: "2.25em" }, 500);
    $('button.show_hide').hide();
});