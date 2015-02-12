
$(document).ready(function () {

  //radio button js 

    $(".radio._main_").on('click',function() {
        var _self = $(this);
        var _parent = _self.parent();

        
        var radio  = _self.find("input");
        if(!radio.is(':checked')) {
           $('.radiobutton').removeClass('active');
           radio.attr("checked","checked");
           radio.siblings(".radiobutton").addClass("active");
        }

      });

  // ends here

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

  $('#mobFilter').on('click',function() {
    var _self = $(this);

    _self.hide();
    _self.siblings('#HideFilter').show();
    $('.mobileFilter').show();

  });

  $('#HideFilter').on('click',function() {
    var _self = $(this);

    _self.hide();
    _self.siblings('#mobFilter').show();
    $('.mobileFilter').hide();

  });

  $('.ui.accordion')
  .accordion()
;

 

  $('#filter').popup({
    inline: true,
    on: 'click',
    position : 'bottom center',
  });

	$('.ui.dropdown').dropdown();

	$('.right.demo.sidebar').sidebar('attach events', '.toggle.button', 'show');

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

  $(document).off('click','.small.test.modal');
  $(document).on('click','.small.test.modal',function () {
    $('#confirmation').modal({
      closable:false
    }).modal('show');
  });

  $(document).off('click','#search-filter');
  $(document).on('click','#search-filter',function(event) {
  //  event.stopPropagation();
    $('#adv-search-filter').modal({
      closable:false
    }).modal('show');
  });

  
  $(document).off('click','.log-in');
  $(document).on('click','.log-in',function() {
		$('#login').modal({
      closable:false
    }).modal('show');
	});


  $(document).off('click','.sell-in');
  $(document).on('click','.sell-in',function() {
   
    $('#sell').modal({
      closable:false
    }).modal('show');
  });

  $(document).off('click','.post-in');
  $(document).on('click','.post-in',function() {
    $('#post').modal({
      closable:false
    }).modal('show');
  });

  // $(document).off('click','.leads-in');
  // $(document).on('click','.leads-in',function() {
  //   $('#leads').modal({
  //     closable:false
  //   }).modal('show');
  // });

  // $(document).off('click','.req-details');
  //  $(document).on('click','.req-details',function() {
  
  // });

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

    // $(document).off('click','.three.wide.column.tab>.ui.small.button');
    // $(document).on('click','.three.wide.column.tab>.ui.small.button',function(event){
    //   event.stopPropagation();
    //   var _self = $(this);
    //   var _parent = _self.parents('#lower-content');
      
    //   $('.three.wide.column.tab>.ui.small.button').removeClass('active');
    //   _self.addClass('active');
    //   _parent.find('.toggleBox').hide();
    //   _parent.find('.'+_self.attr("attr-tab")).css('display','inline-block');
    // });

  });