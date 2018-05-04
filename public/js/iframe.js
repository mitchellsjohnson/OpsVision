$( document ).ready( function () {
    $('iframe').height((window.innerHeight|| document.body.clientHeight));
	$(window).resize(function () { $('iframe').height((window.innerHeight|| document.body.clientHeight)); });
});