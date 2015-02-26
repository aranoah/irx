
	var map;
	var infowindow;
	var pyrmont;
	var geocoder= new google.maps.Geocoder();
	var outdivtext;
	var pl_name;

	function locationDecoder(){
		geocoder.geocode( { 'address': $("#location").text()}, function(results, status) {
		    if (status == google.maps.GeocoderStatus.OK && results!=null) {
		      	pyrmont =results[0].geometry.location;
     			map.setCenter(pyrmont);
		      	var marker = new google.maps.Marker({
					map: map,
					position: pyrmont
		      	});
			 //  	var request = {
				// 	location: pyrmont,
				// 	radius: 1000,
				// 	types: ['atm','store','bank','food','airport','bus_station','train_station']
				// };
				// infowindow = new google.maps.InfoWindow({maxWidth: 200});
				// var service = new google.maps.places.PlacesService(map);
				// service.nearbySearch(request, callback);
		    } 
	  	});
	}
	function getpl(that_id)	{
		map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: pyrmont,
			zoom: 15
		});

		var request = {
			location: pyrmont,
			radius: 500,
			types:[that_id]
		};
		infowindow =new google.maps.InfoWindow();
		var service = new google.maps.places.PlacesService(map);
		service.nearbySearch(request, callback);
	}

	function initialize() {

		map = new google.maps.Map(document.getElementById('map-canvas'), {
			center: pyrmont,
			zoom: 13
		});
		locationDecoder();
	}

	function callback(results, status) {
	  	if (status == google.maps.places.PlacesServiceStatus.OK) {
		    for (var i = 0; i < results.length; i++) {
		      createMarker(results[i]);
		    }
	   }
	}

	function createMarker(place) {
		var placeLoc = place.geometry.location;
		var marker = new google.maps.Marker({
		map: map,
			position: place.geometry.location,
		});

	  	google.maps.event.addListener(marker, 'click', function() {
		    infowindow.setContent("Place Name : "+place.name +"<br>"+"Place Co-ordinates :"+place.geometry.location+"<br>"+"Place Ratings : "+place.rating+"<br>"+"PLace Vicinity :"+place.Vicinity+"<br>Place type : "+place.types);  
		    infowindow.open(map, this);
	  	});
	}

	initialize();

	function Project(option){
		page={
			start:0,
			pageSize:5
		}
		this.agentIds = [];
	}
	
	Project.prototype.init = function() {

	    var _classInstance = this;
	    // _classInstance.aPostReqViewModel = common.getViewModel('postAgent');
	    // ko.applyBindings(_classInstance.aPostReqViewModel,document.getElementById("_postA_"));
	    var projectId = $('#_projectId_').val();
	    _classInstance.viewModel = {
	       showAgent:ko.observable(false),
	      agents: ko.observableArray(),
	      requestDetails : function(id){
				_classInstance.requestDetails(id);
			},
			enquireNow : function(id){

				_classInstance.enquireNow(id);
			},
			fbIntegration:function(id){
				return '<div class="fb-like" data-href="<%=locals.hosturl%>/'+id+'" data-layout="button_count" data-action="like" data-show-faces="false" data-share="true"></div>';
			},
			checkData:function(data){
				if(!data.name){
					data.name='';
				}
				if(!data.irxId){
					data.irxId='';
				}
				if(!data.companyName){
					data.companyName='';
				}
				if(!data.imageUrl){
					data.imageUrl='';
				}
				_classInstance.viewModel.addAgent(data.name,data.irxId,data.companyName,data.imageUrl)
			},
			addAgent:function(name,id,companyName,imageUrl){
				_classInstance.resetForm($('#leads'))
				$('#leads').find('.field.error').removeClass('error')
				$('#leads').modal({
		     	 closable:false
		   		 }).modal('show');
				$('._showAgent_').show();
      	 		$("#_projectIdP_").val(projectId);
      	 		$("#_agentIdP_").val(id);
      	 		$('.agentName').text(name);
      	 		$('.companyName').text(companyName);
      	 		if(!imageUrl || imageUrl== null || imageUrl==""){
      	 			imageUrl="/images/elliot.jpg"
      	 		}
		        $('._pImageLead_').css("background-image",'url('+imageUrl+')')
		    }
			
	    }
	
	    _classInstance.listPreferredAgents(projectId);

	    _classInstance.addToLastVisited();
	  	ko.applyBindings(_classInstance.viewModel,document.getElementsByClassName('projDet')[0]);

	  	$(".locality .title").click(function(){
	  		var _self=$(this);
	  		$(".locality .title").removeClass('active');
 	 		_self.addClass("active");
 	 		getpl(_self.attr('data-tab-item'))
	  	});
	}
	
	Project.prototype.listPreferredAgents = function(projectId) {
		
		var classInstance = this;
    	httpUtils.get("/prefered-agents/"+projectId,{page:classInstance.page},"JSON",function(data){
    		classInstance.viewModel.showAgent(true)
	       	if(data.status==0){
	        	ko.utils.arrayPushAll(classInstance.viewModel.agents,data.result)
	        	if(data.page!=null)
	        		classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
	       	} 
    	})
	}

	Project.prototype.requestDetails = function(projectId) {
		httpUtils.get('/request-details/'+projectId,{},"JSON",function(data){
       		if(httpUtils.checkStatus(data,false,true)){
	       		$('#req-details').modal({
	      			closable:false
	    		}).modal('show');
         	}
        });
      };
      Project.prototype.resetForm=function(lead){
      	 lead.find('input[name="bhk"]').val("");
		 lead.find('input[name="action"]').val("");
		 lead.find('input[name="propertyType"]').val("");
		 lead.find('.ui.selection.dropdown').dropdown('restore defaults');
      }
      Project.prototype.enquireNow = function(projectId) {
      	var classInstance = this;
      	classInstance.resetForm($('#leads'))
      	$('#leads').find('.field.error').removeClass('error')
      	$('._showAgent_').hide();
		
      	$("#_agentIdP_").val("");
      	$("#_projectIdP_").val(projectId);
      	$('#leads').modal({
		      closable:false
		    }).modal('show');
      };

      Project.prototype.getPriceText = function(amount) {
		
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
	  Project.prototype.addToLastVisited = function(){
		    httpUtils.post("/add-last-visited",{"name":$('#__name_').val(),"url":"http://indianrealtyexchange.com/project/"+$('#_projectId').val(),"type":"project"},{},"JSON",function(data){
		        
		        })
		  }
	$(document).ready(function(){
		var proj = new Project();
		proj.init();
		
	})
