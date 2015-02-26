
	function Home(){

		
		this.type={
	      "irx-eproduct":"project",
	      "irx-euser":"user"
	    }
	    this.parent = "homescreen"
	}
	Home.prototype.init = function(first_argument) {
		 var _classInstance = this;
	  	_classInstance.viewModel = {
	  		searchType:ko.observable("project"),
	  		city:ko.observable(),
	  		showCity:ko.observable(),
	  		minPrice:ko.observable(),
	  		maxPrice:ko.observable(),
	  		placeholderVal:ko.observable("Search project by name or location.."),
	  		searchFun : function(formElement){
	  			
	            if(_classInstance.viewModel.searchType()=='project'){
	            	
	               $(formElement).attr('action','/project-listing')
	                return true;
	            
	            } else if(_classInstance.viewModel.searchType()=='agent'){
	             
	               $(formElement).attr('action','/agent-listing')
	                return true;
	              
	            }	
	        
	  		}
	  	}
	  	 _classInstance.viewModel.minPriceText = ko.pureComputed(function() {
        var minPrice =  _classInstance.viewModel.minPrice();
        var minPriceText = "";
        if(minPrice){
          return _classInstance.getPriceText(minPrice)
        }else{
          return minPrice;
        }
        
    }, _classInstance.viewModel);

	  $('#'+_classInstance.parent).off('change','input[name="city"]')
    $('#'+_classInstance.parent).on('change','input[name="city"]',function(){
      var city = $(this).val();
      city = city.replace(/&nbsp;/gi,'')
      city = city.trim();
      _classInstance.viewModel.city(city)
      
      localStorage.setItem("city", city);
     
    });
     $('#'+_classInstance.parent).off('change','#_actn_')
    $('#'+_classInstance.parent).on('change','#_actn_',function(){
      var action = $(this).val();
     localStorage.setItem("action", action);
     
    });
   _classInstance.viewModel.maxPriceText = ko.pureComputed(function() {

        var maxPrice =  _classInstance.viewModel.maxPrice();
        var minPriceText = "";
        if(maxPrice){
          var minPrice = _classInstance.viewModel.minPrice;
          if(minPrice && Number(maxPrice)<Number(minPrice)){
            
            _classInstance.viewModel.minPrice(100)
          } 
          
          return _classInstance.getPriceText(maxPrice)
        }else{
          return maxPrice;
        }

    }, _classInstance.viewModel);
	  	$('#'+_classInstance.parent).on('click','._budgetItem_',function(){
		      var minPrice = $('#_budget_').find(".minP").val();
		      var maxPrice = $('#_budget_').find(".maxP").val();
		      if(minPrice){
		        _classInstance.viewModel.minPrice(minPrice)
		      }
		      if(maxPrice){
		        _classInstance.viewModel.maxPrice(maxPrice)
		      }
		    });
    
	     $('#'+_classInstance.parent).on('click','._sType_',function(){
	     	var _self = $(this)

            $(".field._sType_").removeClass("active");
      		_self.addClass("active");
        
	    	if(_self.attr('data-attr')=="project"){
	    		
	    		_classInstance.viewModel.placeholderVal("Search project by name or location..")
	    	} else if(_self.attr('data-attr')=="agent"){
	    		
	    		_classInstance.viewModel.placeholderVal("Search agent by name ,location or project name..")
	    	} else if(_self.attr('data-attr')=="locality"){
	    		
	    		_classInstance.viewModel.placeholderVal("Search location..")
	    	}
	     	_classInstance.viewModel.searchType(_self.attr('data-attr'))
	     });

	     $('#'+_classInstance.parent).find("#__searchHome").autocomplete({
	           
	            source: function(request, response){

	                var _self = this;
	                
	                if(_classInstance.viewModel.searchType()=='project'){
	                	//var data={"text":request.term,"city":_classInstance.viewModel.city()}
	                	var data={"text":request.term,"city":_classInstance.viewModel.city()}
	                  _classInstance.projectAutocomplete(data,request,response)
	                
	                } else if(_classInstance.viewModel.searchType()=='agent'){
	                	var data={"text":request.term,"city":_classInstance.viewModel.city()}
	                  _classInstance.agentAutocomplete(data,request,response)
	                
	                }else if(_classInstance.viewModel.searchType()=='locality'){
						var data={"text":request.term,"city":_classInstance.viewModel.city()}

                       data["type"]="location";
                  _classInstance.projectAutocomplete(data,request,response)
                }
	              },
	              minLength: 2,
	              dataType: "json",
	              cache: false,
	              appendTo:'#autoDiv',
	              focus:function( event, ui ){
	              	$(this).val(ui.item.real);
	              	return false;
	              },
	              select: function( event, ui ) {
	              	var textName = _classInstance.removeHtml(ui.item.name)
	                  $('#__searchHome').val(textName)
	                   //_classInstance.viewModel.name(ui.item.name);
	                  
	                   if(_classInstance.viewModel.searchType()=='agent'){
	                    if(_classInstance.type[ui.item.type]=='project'){
	                      
	                      $('#__projectId').val(ui.item.id);
	                      if(ui.item.productType=="location"){
				              	$("#__isLocality").val("true")
				              }
	                      
	                    } else if(_classInstance.type[ui.item.type]=='user'){
	                    
	                    	  location.href="/"+ui.item.irxId;
	                    }else{
	                      
	                      $('#__projectId').val("");
	                    }
	                    
	                  }else if(_classInstance.viewModel.searchType()=='project'){
	                  	if(ui.item.productType == 'project'){
                    
                      		location.href="/project/"+ui.item.id;
                   	 	}
	                  }
	                  
	                   return false;
	              }
	              }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
	                $(".ui-widget-content .ui-state-focus");
	                var type="";
	                var icon ="";
	                if(item.type){
	                  type="<div class='description itLabel'>"+_classInstance.type[item.type]+"</div>"
	                }

	                if(item.type=='irx-euser') {
	                  icon = "<i class='icon user right floated'></i>"
	                }else {
	                  icon ="<i class='icon building outline right floated'></i>"
	                }
	                var data = "<a class='item'>"+icon+"<div class='content'><div class='itLabel header'>"+item.name+"</div>"+type+"</div></div></a>"
	                if(item.id == -1){
	                 
	                    data = "<a class='item'><div class='itLabel header _enter_'>Seaching for <b>"+item.name+"</b></div></a>"
	                }
	                 return $( "<li class='ui divided list'>" ).append(data).appendTo(ul);
	                 
	            };  
	  
	   
			    // $(document).on('change','.__searchType',function(){
			    // 	var _self = $(this);

			    // 	_classInstance.viewModel.searchType(_self.val())
			    // })
	    
	    $('.search.icon').click(function(){
	    	// _classInstance.submitForm();
	    })
	   ko.applyBindings(_classInstance.viewModel,document.getElementById('homescreen'))
	};
	
	// Home.prototype.submitForm = function(formElement) {
	// 	var _classInstance = this;
	// 	if(formElement){
 	//            if(_classInstance.viewModel.searchType()=='project'){
 	//            	console.log("ffff",formElement)
 	//               $(formElement).attr('action','/project-listing')
 	//                return true;
            
 	//            } else if(_classInstance.viewModel.searchType()=='agent'){
             
 	//               $(formElement).attr('action','/agent-listing')
 	//                return true;
              
 	//            }	
 	//        }
	// };
 	
 	Home.prototype.projectAutocomplete=function(reqData,request,response){
      var classInstance = this;
       httpUtils.get("/project-autocomplete",reqData,"JSON",function(data){
       if(data.status==0){
        
          var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
       
          arr.push({fields:{id:[-1],name:reqData.text}})
          response($.map(arr, function(item) {
            var name ="",nameValue='';
            if(item.highlight && item.highlight.name && item.highlight.name.length > 0){
               name = item.highlight.name[0]
            }else{
              name = item.fields.name
            }
            nameValue=(item.fields.name?item.fields.name[0]:'');
            var location ={}
            if(item.fields['location.city'] &&  item.fields['location.city'].length >0){
              var lCity = item.fields['location.city'];
              location = lCity[0];
            }
           
           var locationName ={}
           
            if(item.fields['location.name'] &&  item.fields['location.name'].length >0){
              var lName = item.fields['location.name'];

              locationName = lName[0];
            }
            var productType =""
            if(item.fields.productType &&  item.fields.productType.length >0){
              productType = item.fields.productType[0];
            }
           
            return {id:item.fields.id[0],name:name,location:location,productType:productType,locationName:locationName,real:nameValue};
          }));
        }
    })
    }
    
    Home.prototype.agentAutocomplete=function(reqData,request,response){
     var classInstance = this;
      httpUtils.get("/autocomplete",reqData,"JSON",function(data){
        if(data.status==0){
           var arr = data.result;
         if(data.result == null){
          arr = new Array();
         }
          arr.push({fields:{id:[-1],name:reqData.text}})
          response($.map(data.result, function(item) {
            var name ="";
            if(item.highlight && item.highlight.name && item.highlight.name.length > 0){
               name = item.highlight.name[0]
            }else{
              name = item.fields.name
            }    
            var productType="";
            if(item.fields && item.fields.productType && item.fields.productType.length >0){
              productType = item.fields.productType[0]

            }
            var id="";
            if(item.fields && item.fields.id && item.fields.id.length >0){
              id = item.fields.id[0]
            } 
            var irxId="";
            if(item.fields && item.fields.irxId && item.fields.irxId.length >0){
              irxId = item.fields.irxId[0]
            } 

            return {id:id,name:name,type:item._type,productType:productType,irxId:irxId};
          }));
        }
    })
    }
	var home;

	$(document).ready(function(){
		home = new Home();
		home.init();
		var city = localStorage.getItem("city");
			
		  if(city){
		   home.viewModel.showCity(city)
		    home.viewModel.city(city)

		  } else{
		    home.viewModel.city("gurgaon")
		    home.viewModel.showCity("Gurgaon")
		  }
		// $("#mainSearchCity").append($city);
		// <% if(!locals.session.user){%>
		// 	<% if(locals.req.query.req && locals.req.query.req=='login'){%>
		// 		$(".log-in").click();
		// 	<%}%>
		// <%}%>	
	});

	Home.prototype.getPriceText = function(amount) {
    var text = "";
    if(amount.length==4 || amount.length==5){
        amount = Number(amount)/1000;
        text = amount+"K";
      } else if(amount.length==6 || amount.length==7){
        amount = Number(amount)/100000;
        text = amount+"Lac";
      } else if(amount.length>8){
        amount = Number(amount)/10000000;
        text = amount+"Cr";
      } else {
        text = amount
      }
      return text;
  };
	Home.prototype.removeHtml = function(name) {
    if(name){
       return name.replace(/<(?:.|\n)*?>/gm, '');
    } else{
      return "";
    }
                     
};
