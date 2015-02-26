

		function Project(options){
			this.page = {
				start : 0,
				pageSize : 10
			}
		 this.filterName = $('#__filterName').val()
		 if(typeof(this.filterName) == "undefined" || this.filterName == null ){
		 	this.filterName = "";
		 }
		 this.filterBhk = $('#__filterBhk').val()
		 if(typeof(this.filterBhk) == "undefined" || this.filterBhk == null ){
		 	this.filterBhk = "";
		 }
		 this.filterType = $('#__filterType').val()
		 if(typeof(this.filterType) == "undefined" || this.filterType == null ){
		 	this.filterType = "";
		 }
		 this.locationFlag1 = $('#__locationFlag').val()
		 if(typeof(this.locationFlag1) == "undefined" || this.locationFlag1 == null ){
		 	this.locationFlag1 = false;
		 }
		 this.projectIdFilter = $('#__projectIdFilter').val()
		 if(typeof(this.projectIdFilter) == "undefined" || this.projectIdFilter == null ){
		 	this.projectIdFilter = false;
		 }
		 this.minP = $('#__minPrice').val()
		 if(typeof(this.minP) == "undefined" || this.minP == null ){
		 	this.minP = "";
		 }
		  this.maxP = $('#__maxPrice').val()
		 if(typeof(this.maxP) == "undefined" || this.maxP == null ){
		 	this.maxP = "";
		 }
		}
	Project.prototype.init = function(city) {

		var _classInstance = this;
		
		_classInstance.aPostReqViewModel = common.getViewModel('postAgent');
		common.aPostReqViewModel = _classInstance.aPostReqViewModel;
		ko.applyBindings(_classInstance.aPostReqViewModel,document.getElementById("_postA_"));
  		$(document).on("click",".pagination",function(){
            var imgNode= $(this).parents("#_projImg").find(".projectImage");
            var imgC = Number(imgNode.attr("data-size"));
            var currImg = Number(imgNode.attr("data-curr"));
             var $index = Number(imgNode.attr("index"));
           // src: gallery[0],'data-size':gallery.length,'index':$index
           
            var len = _classInstance.viewModel.projects()[$index].gallery.length;
            if($(this).hasClass("right")){
                currImg++;
            }else{
              currImg--;   
            }
            if(currImg<0){
              currImg=len-1;   
            }
            else if(currImg>=len-1){
                currImg=0;
            }
             var img = _classInstance.viewModel.projects()[$index].gallery[currImg];
           
             imgNode.attr("src",img);
             imgNode.attr("data-curr",currImg);
        });
  		$(document).on('click','._hasDistress_',function(){
  			_classInstance.resetPage();
  			var self = $(this);
  			
  			if(self.hasClass('checked')){
  				_classInstance.viewModel.filters.distress(true);
  			}else{
  				_classInstance.viewModel.filters.distress(false);
  			}
  			
  			_classInstance.listProjects(true)
  		});
		
		_classInstance.enViewModel = {
			bhkArr: ko.observableArray(),
			typeArr: ko.observableArray(),
			bhk:ko.observable(),
			type: ko.observable(),
			projectId:ko.observable(),
			projectName:ko.observable()
		},
		_classInstance.viewModel = {
			isInitPro:ko.observable(false),
			isInitAg:ko.observable(false),
			projects: ko.observableArray(),
			agents : ko.observableArray(),
			totalCount : ko.observable(),
            hasMore:ko.observable(false),
			galleryIndex : ko.observableArray([]),
			filters: {
				displayName:ko.observable("All"),
				name:ko.observable(_classInstance.filterName),
				bhk:ko.observable(_classInstance.filterBhk),
				type:ko.observable(_classInstance.filterType),
				order:ko.observable("asc"),
				distress:ko.observable(false),
				status:ko.observable(""),
			    locationFlag :ko.observable(_classInstance.locationFlag1),
			    projectId:ko.observable(_classInstance.projectIdFilter),
			    minPrice:ko.observable(_classInstance.minP),
			    maxPrice:ko.observable(_classInstance.maxP),
			    city:ko.observable(city)
			},
			addAgent:function(name,id,companyName,imageUrl){
				var agent={"name":name,"id":id,"companyName":companyName,"irxId":id,"imageUrl":imageUrl}
				
				var arr=[];
				arr.push(agent)
				_classInstance.aPostReqViewModel.data.agentId([])
				//for future it has been kept araay and push all so that we can select multuiple agents
				// and send them leads
				ko.utils.arrayPushAll(_classInstance.aPostReqViewModel.data.agentId,arr);
				//console.log("yo !!",_classInstance.aPostReqViewModel.data.agentId())
			 
				$('#_postA_').modal({
			   	   	closable:false
		    	}).modal('show');
		    },
			addSome : function(){
				
				//_classInstance.listProjects(true);
			},
			applyFilters : function(){
				
				_classInstance.resetPage();
				_classInstance.listProjects(true);
				return true;
			},
			removeFilters : function(filterName){
				 if(filterName=='maxPrice'){
				 	_classInstance.viewModel.filters["minPrice"](0);
				 	_classInstance.viewModel.filters["maxPrice"](0);
				 }else{

				  _classInstance.viewModel.filters[filterName]("");
			    }
				_classInstance.resetPage();
				$('.'+filterName).dropdown('restore defaults');
				_classInstance.listProjects(true);
				return true;
			},
			requestDetails : function(data){
				_classInstance.requestDetails(data.id);
			},
			fbIntegration:function(data){
				return '<div class="fb-like" data-href="<%=locals.hosturl%>/'+data.id+'" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>';
			},
			enquireNow : function(data){
				
				_classInstance.enquireNow(data);
			},
			getNextImage : function($index){
				_classInstance.viewModel.galleryIndex(_classInstance.viewModel.galleryIndex()+1)

			},
			getPreviousImage : function($index){
				_classInstance.viewModel.galleryIndex(_classInstance.viewModel.galleryIndex()-1)
			},
			
			pageSize: ko.observable(_classInstance.page.pageSize),
			start: ko.observable()
		}
		ko.applyBindings(_classInstance.enViewModel,document.getElementById('leadsF'))	
		 ko.applyBindings(_classInstance.viewModel,document.getElementById('projListing'));

	
		 if(_classInstance.viewModel.filters.locationFlag()=='true'){
		 	
		 	_classInstance.listProjectsOfLocation(true);
		 }else{
		 	_classInstance.listProjects(true);
		 }
		
	};

	Project.prototype.resetFilters = function(filters) {
		var _classInstance=this;
		_classInstance.viewModel.filters.name(filters.name)
		_classInstance.viewModel.filters.bhk(filters.bhk)
		_classInstance.scroller.updating=true;
		
		_classInstance.resetPage();
	}
	 Project.prototype.listProjectsOfLocation=function(localityId,replace,setUpdate){
      var classInstance = this;
     
          var data = {
            "localityId":classInstance.viewModel.filters.projectId()
          }
          var filters = {
            "name" : classInstance.viewModel.filters.name()
          }
         
          httpUtils.post("/list-projects",
                        {filters:data,page:classInstance.page},
                        {},"JSON",function(data){
           if(typeof(replace) != undefined && replace){
	       		classInstance.viewModel.projects([]);
	       	}
	        if(data.page.start==0){
	        	classInstance.viewModel.totalCount(data.page.total)
	        }
	       	if(data.result == null || data.result.length == 0){
	       		classInstance.listLocationAgent();
	       		return;
	       	} else{
	       		classInstance.viewModel.agents([]);
	       	}
	       	var arr = data.result;
		 	 classInstance.setPriceText(arr);
			
	       ko.utils.arrayPushAll(classInstance.viewModel.projects,arr)	
	       classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
	        classInstance.viewModel.start(classInstance.page.start) ;
	        classInstance.viewModel.pageSize=data.page.pageSize;
            classInstance.viewModel.hasMore(data.page.hasMore);
	        if(setUpdate){
	        	
	       		setUpdate(data.page.hasMore)
	       	}
        })
     
    }
    
    Project.prototype.setPriceText=function(arr){
    	var classInstance = this;
		for (var i=0;i<arr.length;i++){
 			
 			var price =  arr[i].price;
	        var aPriceArr = new Array();

	        for (var j=0;j<price.length;j++){
	        	var aPrice = price[j];
	        	
	        	 if(aPrice){
		          var aPriceText =  classInstance.getPriceText(""+aPrice)

		          aPriceArr.push(aPriceText);
		        }else{
		         aPriceArr.push(aPrice);
		        }
	        }

	       arr[i].priceText =  aPriceArr;
 		}
 		return arr;
    }

	Project.prototype.resetPage = function(filters) {
		var _classInstance=this;
		_classInstance.page.start=0;
	}
	Project.prototype.getPriceText = function(amount) {
		
    var text = "";
    if(amount.length==4 || amount.length==5){
        amount = Number(amount)/1000;
        text = amount+"K";
      } else if(amount.length==6 || amount.length==7){
        amount = Number(amount)/100000;
        text = amount+"Lac";
      } else if(amount.length>=8){
        amount = Number(amount)/10000000;
        text = amount+"Cr";
      } else {
        text = amount
      }
      return text;
  };
	Project.prototype.requestDetails = function(projectId) {
		httpUtils.get('/request-details/'+projectId,{},"JSON",function(data){
       if(data.status==0){
	       	$('#req-details').modal({
	      		closable:false
	    	}).modal('show');
         }
        })
      };
      
      Project.prototype.enquireNow = function(project) {
      	var classInstance = this;
      	var bhkStr = '';
      	classInstance.enViewModel.bhkArr([]);
  		classInstance.enViewModel.typeArr([]);
  		classInstance.enViewModel.bhk();
  		classInstance.enViewModel.type();
  		classInstance.enViewModel.bhk(classInstance.viewModel.filters.bhk());
		
  		classInstance.enViewModel.type(classInstance.viewModel.filters.type());
      	ko.utils.arrayPushAll(classInstance.enViewModel.bhkArr,project.bhk);
      	var pType = project.type;
      	if(typeof pType =="string"){
      		pType = new Array(pType)
      	}
      	ko.utils.arrayPushAll(classInstance.enViewModel.typeArr,pType);
      	classInstance.enViewModel.projectName(project.name)
      	$('#leadsF').modal({
		    closable:false
		}).modal('show');
      	$("#_projectIdP_").val(project.id);
      };


	Project.prototype.renderResult = function(data,filters) {
		var classInstance = this;  
		classInstance.viewModel.projects([]);
		classInstance.viewModel.filters.name(filters.name);
		classInstance.viewModel.filters.displayName(filters.name);
		classInstance.viewModel.filters.bhk(filters.bhk);

		classInstance.viewModel.filters.city(filters.city)
		if(filters.projectId){
			classInstance.viewModel.filters.projectId(""+filters.projectId);
		}
		if(filters.locationFlag){
			classInstance.viewModel.filters.locationFlag(""+filters.locationFlag);
		}
		
		 if(data.page.start==0){
	        	classInstance.viewModel.totalCount(data.page.total)
	        }
		if(data.result == null || data.result.length == 0){
	       		classInstance.listLocationAgent();
	       		return;
	       	} else{
	       		classInstance.viewModel.agents([]);
	       	}

			var arr = data.result;
		 	classInstance.setPriceText(arr);
			classInstance.viewModel.projects([])
	       	ko.utils.arrayPushAll(classInstance.viewModel.projects,arr)	
			//ko.utils.arrayPushAll(classInstance.viewModel.projects,data.result)	
		$('.doubling.two.column.row').hide();
			classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
	        classInstance.viewModel.start(classInstance.page.start) ;
	        classInstance.viewModel.pageSize=data.page.pageSize;

	}
	
	Project.prototype.listLocationAgent = function() {
		var classInstance = this;

		httpUtils.post("/list-agents",{
			filters:
				{"city":classInstance.viewModel.filters.city},
			page:
				{"start":0,"pageSize":5}
			},{},"JSON",function(data){
				classInstance.viewModel.isInitAg(true)
                 classInstance.viewModel.agents([]);
	    		if(data.result != null && data.result.length !=0 ){
	    			

	    			 ko.utils.arrayPushAll(classInstance.viewModel.agents,data.result)	
	    			 
	    		}else{
	    			$('._pnf').hide();
	    		}
	      })
	}

	Project.prototype.listProjects = function(replace,setUpdate) {
		
		var classInstance = this;
		//alert(classInstance.viewModel.filters.type)
         classInstance.viewModel.hasMore(false);
    	classInstance.viewModel.filters.city(localStorage.getItem("city"));
	    httpUtils.post("/list-projects-elastic",{filters:classInstance.viewModel.filters,page:classInstance.page},{},"JSON",function(data){
	    	classInstance.viewModel.isInitPro(true);   
	       if(data.status==0){

	       	
            classInstance.viewModel.hasMore(data.page.hasMore);
	       	if(typeof(replace) != undefined && replace){
	       		classInstance.viewModel.projects([]);
	       	}
	       	 if(data.page.start==0){
	        	classInstance.viewModel.totalCount(data.page.total)
	        }
	       	if(data.result == null || data.result.length == 0){
	       		classInstance.listLocationAgent();
	       		return;
	       	} else{
	       		classInstance.viewModel.agents([]);
	       	}
	       	var arr = data.result;

	       	if(!arr || arr == null || arr.length==0){
	       		return
	       	}
		 		classInstance.setPriceText(arr);
		
	       ko.utils.arrayPushAll(classInstance.viewModel.projects,arr)
	      
	       classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
	        classInstance.viewModel.start(classInstance.page.start) ;
	        classInstance.viewModel.pageSize=data.page.pageSize;
            
	        if(setUpdate){
	        	
	       		setUpdate(data.page.hasMore)
	       	}
	        }
		})
	 }

		var project = null;
		$(document).ready(function(){
	  	
		    project = new Project();
		    var city = localStorage.getItem("city");
	    	project.init(city);
	     
		  $('._hide_').show()
	  	})