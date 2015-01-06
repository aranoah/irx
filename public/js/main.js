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

  $('.menu .item').tab();

  $('.compact.button')
  .popup({
    inline: true,
    on    : 'click',
    position: 'bottom left'
  })
;
	
	$(window).scroll(function () {

	    var s =  $(window).scrollTop();

	    if(s >= 40) {
	    	$( "#search-bar" ).css( "marginTop", 0);
	    }else {
	    	$( "#search-bar" ).css( "marginTop", '3.5rem');
	    }
	    	    
	});

  $('.ui.radio.checkbox').checkbox();
  $('.ui.checkbox').checkbox();

	$('.log-in').bind('click',function() {
		$('#login').modal({
      closable:false,
    }).modal('show');
	});

  $('.sell-in').bind('click',function() {
    $('#sell').modal({
      closable:false,
    }).modal('show');
  });

  $('.post-in').bind('click',function() {
    $('#post').modal({
      closable:false,
    }).modal('show');
  });

  $('.leads-in').bind('click',function() {
    $('#leads').modal({
      closable:false,
    }).modal('show');
  });

  $('.req-details').bind('click',function() {
    $('#req-details').modal({
      closable:false,
    }).modal('show');
  });

});

$(document)
  .ready(function() {

    var
      changeSides = function() {
        $('.ui.shape')
          .eq(0)
            .shape('flip over')
            .end()
          .eq(1)
            .shape('flip over')
            .end()
          .eq(2)
            .shape('flip back')
            .end()
          .eq(3)
            .shape('flip back')
            .end()
        ;
      },
      validationRules = {
        firstName: {
          identifier  : 'email',
          rules: [
            {
              type   : 'empty',
              prompt : 'Please enter an e-mail'
            },
            {
              type   : 'email',
              prompt : 'Please enter a valid e-mail'
            }
          ]
        }
      }
    ;

    $('.ui.dropdown')
      .dropdown({
        on: 'hover'
      })
    ;

    $('.ui.form').form(validationRules, {
          on: 'blur'
    });

    $('.masthead .information').transition('scale in', 1000);

    setInterval(changeSides, 3000);

    $(document).on('click','.three.wide.column.tab>.ui.small.button',function(){

      var _self = $(this);
      var _parent = _self.parents('#lower-content');

      $('.three.wide.column.tab>.ui.small.button').removeClass('active');
      _self.addClass('active');
      _parent.find('.toggleBox').hide();
      _parent.find('.'+_self.attr("attr-tab")).css('display','inline-block');
    });

  });