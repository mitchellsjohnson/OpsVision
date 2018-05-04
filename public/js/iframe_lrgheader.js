$( document ).ready( function () {
    $('iframe').height(((window.innerHeight|| document.body.clientHeight)-100));
	$(window).resize(function () { $('iframe').height(((window.innerHeight|| document.body.clientHeight))-100); });
});