
	function Agent(options){
		this.page = {
			start : 0,
			pageSize :10
		}
		this.agentIds = [];
	}
	Agent.prototype.init = function(city) {
		var _classInstance = this;
		_classInstance.aPostReqViewModel = common.getViewModel('_postA_');
		common.aPostReqViewModel = _classInstance.aPostReqViewModel;
		ko.applyBindings(_classInstance.aPostReqViewModel,document.getElementById("_postA_"));
		
		ko.bindingHandlers.scroll = {

		  updating:true,
		  
		  init: function(element, valueAccessor, allBindingsAccessor) {
		  	 
		      var self = this
		      self.updating =(true);
		      ko.utils.domNodeDisposal.addDisposeCallback(element, function() {
		            $(window).off("scroll.ko.scrollHandler")
		            self.updating= (false); 
		      });
		      $(element).append('<div id="_sc_more" style="height:100px;display:none" hasMore="true"></div>');
		      $(element).on('__sc__more', function(e,flag){
				  	 var ele_more = $('#_sc_more');
				  	 if(typeof(flag) == "undefined"){
				  	 	return ele_more.attr("hasMore")=='true';
				  	 }else{
				  	 	if(flag){
				  	 		ele_more.show();
				  	 	}else{
				  	 		ele_more.hide();
				  	 	}
				  	 	ele_more.attr("hasMore",flag);
				  	 	return flag;
				  	 }
				  })
		  		},

		  update: function(element, valueAccessor, allBindingsAccessor){
		    var props = allBindingsAccessor().scrollOptions
		    var offset = props.offset ? props.offset : "0"
		    var loadFunc = props.loadFunc
		    var load = ko.utils.unwrapObservable(valueAccessor());
		    var self = this;

		    if(load){
		      element.style.display = "";
		      $(window).on("scroll.ko.scrollHandler", function(){
		      	
		        if(($(document).height() - offset <= $(window).height() + $(window).scrollTop())){
		          if(self.updating){
		          	
		          	self.updating =(false);

		            _classInstance.listAgents(false,function(success){
		            	
		            	self.updating=success;
		            	$(element).trigger('__sc__more',success)
		            })
		          }
		        }
		       
		      });
		    }
		    else{
		        element.style.display = "none";
		        $(window).off("scroll.ko.scrollHandler")
		        self.updating = false
		    }
		  }
		 }
		 var filterName = $('#__filterName').val()
		 if(typeof(filterName) == "undefined" || filterName == null ){
		 	filterName = "";
		 }
		 var filterBhk = $('#__filterBhk').val()
		 if(typeof(filterBhk) == "undefined" || filterBhk == null ){
		 	filterBhk = "";
		 }
		  var filterType = $('#__filterType').val()
		 if(typeof(filterType) == "undefined" || filterType == null ){
		 	filterType = "";
		 }
		 var projectIdFilter = $('#__projectIdFilter').val()
		 if(typeof(projectIdFilter) == "undefined" || projectIdFilter == null ){
		 	projectIdFilter = "";
		 }
		 var locationFlag = $('#__locationFlag').val();
		 if(typeof(locationFlag) == "undefined" || locationFlag == null ){
		 	locationFlag = "";
		 }
		_classInstance.viewModel = {
			agents: ko.observableArray(),
			filters:{
				name: ko.observable(filterName),
				type: ko.observable(""),
				bhk: ko.observable(filterBhk),
				displayName: ko.observable("All"),
				projectId: ko.observable(projectIdFilter),
				location: ko.observable(locationFlag),
				city:ko.observable(city),
				locationCity : ko.observable()
			},
			start: ko.observable(),
			total: ko.observable(),
			addSome : function(){
				//_classInstance.listAgents(true);
			},
			fbIntegration:function(data){
				
				return '<div class="fb-like" data-href="<%=locals.hosturl%>/'+data.irxId+'" data-layout="button_count" data-action="like" data-show-faces="true" data-share="false"></div>';
			},
			addAgent:function(name,id,companyName,imageUrl){
				if(!imageUrl){
					imageUrl='';
				}
				if(!companyName){
					companyName='';
				}
				var agent={"name":name,"id":id,"companyName":companyName,"irxId":id,"imageUrl":imageUrl}
				var proId = _classInstance.viewModel.filters.projectId();

				
				common.resetForm(_classInstance.aPostReqViewModel,$('#_postA_').find('form'));
				//for future it has been kept araay and push all so that we can select multuiple agents
				// and send them leads
				var arr=[];
				arr.push(agent)
				_classInstance.aPostReqViewModel.data.agentId([])
				
				common.initializeFromLocalStorage(_classInstance.aPostReqViewModel);

				ko.utils.arrayPushAll(_classInstance.aPostReqViewModel.data.agentId,arr);

				if(proId){
					_classInstance.getProjectDetails(proId,function(project){
					_classInstance.aPostReqViewModel.data.projectId(proId);
					_classInstance.aPostReqViewModel.data.proName(project.name);
					_classInstance.aPostReqViewModel.data.bhkArr([]);
					_classInstance.aPostReqViewModel.data.typeArr([]);
					_classInstance.aPostReqViewModel.data.localityId(project.location.locality);
					_classInstance.aPostReqViewModel.data.locality(project.location.name);
					_classInstance.aPostReqViewModel.data.city(project.location.city);
					ko.utils.arrayPushAll(_classInstance.aPostReqViewModel.data.bhkArr,project.bhk);
					ko.utils.arrayPushAll(_classInstance.aPostReqViewModel.data.typeArr,project.type);
				});
					//console.log(project)
					
					
				}
			 
				$('#_postA_').modal({
			   	   	closable:false
		    	}).modal('show');
		    }
		}
		$(document).off('click','#_subReq_')
		$(document).on('click','#_subReq_',function(){

			var arr = _classInstance.agentIds;
			 common.resetForm(_classInstance.aPostReqViewModel,$('#_postA_').find('form'));
			 _classInstance.agentIds=[];
			 common.initializeFromLocalStorage(_classInstance.aPostReqViewModel);
			 _classInstance.aPostReqViewModel.data.agentId([])

			$('#_postA_').modal({
			      closable:false
			    }).modal('show');

			})
		$(document).off('click','._subReqI_')
		$(document).on('click','._subReqI_',function(){

			})
		 
		 ko.applyBindings(_classInstance.viewModel,document.getElementById("agentContent"));
		
		_classInstance.listAgents(true);
	}
	
	Agent.prototype.listAgents = function(replace, setUpdate) {
    	var classInstance = this;
    	if(classInstance.viewModel.filters.projectId() != ""){
           httpUtils.get("/prefered-agents/"+classInstance.viewModel.filters.projectId(),
            {"location":classInstance.viewModel.filters.location(),"city":classInstance.viewModel.filters.city()}
            ,"JSON"
            ,function(result){
            	if(result.extra){
            		classInstance.viewModel.filters.locationCity(result.extra.city);
            	}
            	
         		 classInstance.processResult(result,replace,setUpdate)
          })
    	}else {
    		
    		httpUtils.post("/list-agents",{filters:classInstance.viewModel.filters,page:classInstance.page},{},"JSON",function(data){
    			classInstance.viewModel.filters.locationCity("");
	    		classInstance.processResult(data,replace,setUpdate);
	      })
    	}
	    
	 }
	Agent.prototype.processResult = function(data,replace,setUpdate) {
	 	var classInstance=this;
	 	if(data.status==0){
	       	if(typeof(replace) != undefined && replace){
	       		classInstance.viewModel.agents([]);
	       	} 
	       	ko.utils.arrayPushAll(classInstance.viewModel.agents,data.result)
	       	if(data.page != null){
	       		if(classInstance.page.start==0){
	       			classInstance.viewModel.total(data.page.total) ;
		       	}
	       		classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
	       		classInstance.viewModel.start(Number(data.page.start)+Number(data.result.length)) ;
				if(setUpdate){
	       			setUpdate(data.page.hasMore)
	       		}
	       	}
	   }
	}
	Agent.prototype.renderResult = function(data,filters) {
		
		var classInstance = this;  
		classInstance.viewModel.agents([]);

		if(filters){
			classInstance.viewModel.filters.name(filters.name);
			classInstance.viewModel.filters.projectId(filters.projectId);
			classInstance.viewModel.filters.displayName(filters.name);
			classInstance.viewModel.filters.city(filters.city);
			classInstance.viewModel.filters.location(""+filters.location);
			classInstance.viewModel.filters.locationCity(filters.locationCity);
		}
		if(data && data.result){
			
			classInstance.viewModel.agents([])
			ko.utils.arrayPushAll(classInstance.viewModel.agents,data.result)
		}	
		$('.doubling.two.column.row').hide();
		if(data.page != null){
			classInstance.page.start = Number(data.page.start)+Number(data.page.pageSize);
        classInstance.viewModel.start(classInstance.page.start) ;
        classInstance.viewModel.pageSize=data.page.pageSize;
		classInstance.viewModel.total(data.page.total)
		}
		
		

	};
	Agent.prototype.resetAgent=function(_self){
		var classInstance =this;
		classInstance.viewModel.filters.name('');
		classInstance.viewModel.filters.projectId('');
		classInstance.page.start=0;
		if(_self){
			$(_self).parent().remove();
		}
		classInstance.listAgents(true);
	};
	Agent.prototype.getProjectDetails=function(projectId,projectData){
		httpUtils.get("/project-details/"+projectId,{},"JSON",function(data){
			if(data.status ==0 && data.result){
				projectData(data.result);
			}
		})
	};
	
	var agent = null;
	$(document).ready(function(){
	  
	    agent = new Agent();
	    var city = localStorage.getItem("city");
	    agent.init(city);
	     
		  if(city){
		   
		    agent.viewModel.filters.city(city)
		  }
	    
	    $('._hide_').removeClass('_hide_');

	  })
