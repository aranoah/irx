$(document).ready(function () {

	$('.middleBox>div').mouseenter(function() {
		var _self = $(this);

		_self.addClass('active');
		_self.siblings().removeClass('active');
	});

	$('.middleBox>div').mouseleave(function() {
		var _self = $(this);
		
		_self.removeClass('active');
		_self.siblings().removeClass('active');
	});

	$('.ui.dropdown').dropdown();

	$('.right.demo.sidebar').first().sidebar('attach events', '.toggle.button');

	$('.toggle.button').removeClass('disabled');

	
	$(window).scroll(function () {

	    var s =  $(window).scrollTop();

	    if(s >= 40) {
	    	$( "#search-bar" ).css( "marginTop", 0);
	    }else {
	    	$( "#search-bar" ).css( "marginTop", '3.5rem');
	    }
	    	    
	});

});