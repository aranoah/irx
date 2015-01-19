
function Common() {
	this.postReqLeads="post";
	this.sellPostLeads="sell"
}
Common.prototype.getViewModel = function(type) {
	var classInstance = this;
	var viewModel = {
      data:{
      	emailId:ko.observable(""),
      	projectId:ko.observable(""),
      	agentId:ko.observable(""),
      	name:ko.observable("").extend({ required: true}),
      	mobileNo:ko.observable(""),
      	city:ko.observable(""),
      	bhk:ko.observable(""),
      	type:ko.observable("user"),
      	proName:ko.observable(""),
      	locality:ko.observable(""),
        propertyType:ko.observable(""),
        action:ko.observable(""),
        origin:ko.observable(type)
      },
      captureLeads:function(){

      	classInstance.captureLeads(type);
      }
    };
    return viewModel;
}
Common.prototype.init = function(first_argument) {

	var classInstance = this;
	
	classInstance.viewModelPost = classInstance.getViewModel(classInstance.postReqLeads);
	classInstance.viewModelSell = classInstance.getViewModel(classInstance.sellPostLeads);
	
	classInstance.viewModel = {
		userId: ko.observableArray(),
		tabID : ko.observable('login'),
		password: ko.observable(),
		openTab:function(tabID) {
			classInstance.viewModel.tabID(tabID);
			return false;
		},
		login : function() {
           classInstance.login();
        }

	};
	
   
     $("#"+classInstance.sellPostLeads).find("#__sellPostSearch").autocomplete({

            source: function(request, response){
                var _self = this;
               
                  sBar.projectAutocomplete(request.term,request,response)
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivSell',
              select: function( event, ui ) {

                classInstance.viewModelSell.data.proName(ui.item.name)
                classInstance.viewModelSell.data.locality(ui.item.location.locality)
                classInstance.viewModelSell.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div></a>" ).appendTo(ul);
      }; 
   
    $("#"+classInstance.postReqLeads).find("#__postReqSearch").autocomplete({

            source: function(request, response){
                var _self = this;
               
                  sBar.projectAutocomplete(request.term,request,response)
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivPost',
              select: function( event, ui ) {

                classInstance.viewModelPost.data.proName(ui.item.name)
                classInstance.viewModelPost.data.locality(ui.item.location.locality)
                classInstance.viewModelPost.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div></a>" ).appendTo(ul);
      };  
    ko.applyBindings(classInstance.viewModelPost,document.getElementById(classInstance.postReqLeads))
 	ko.applyBindings(classInstance.viewModelSell,document.getElementById(classInstance.sellPostLeads))
	ko.applyBindings(classInstance.viewModel,document.getElementById("login"));


};
Common.prototype.login = function() {
	var classInstance = this;
	httpUtils.post("/login",
		{userId:classInstance.viewModel.userId,password:classInstance.viewModel.password},
		 { 'authorization': 'POST' },"JSON",function(data){
		if(data.status==0){
	      alert(1)
		}else {
			
		}
	})
};		 
Common.prototype.captureLeads = function(type) {
	var classInstance = this;
	var viewModel = null;
	if(type == classInstance.postReqLeads){
		viewModel = classInstance.viewModelPost;
	} else{
		viewModel = classInstance.viewModelSell;
	}
	httpUtils.post("/capture-lead",
		viewModel.data,
		 { },"JSON",function(data){
		if(data.status==0){
	       alert(1)
		}else {
			
		}
	})
};	
