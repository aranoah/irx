
function Common() {
	this.postReqLeads="post";
}

Common.prototype.init = function(first_argument) {

	var classInstance = this;
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
	
    classInstance.viewModelLeads = {
      data:{
      	emailId:ko.observable(""),
      	projectId:ko.observable(""),
      	agentId:ko.observable(""),
      	name:ko.observable(""),
      	mobileNo:ko.observable(""),
      	city:ko.observable(""),
      	bhk:ko.observable(""),
      	type:ko.observable("user"),
      	proName:ko.observable(""),
      	locality:ko.observable(""),
        propertyType:ko.observable(""),
        action:ko.observable(""),
        origin:ko.observable("post-req")
      },
      captureLeads:function(){
      	classInstance.captureLeads();
      }
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

                classInstance.viewModelLeads.data.proName(ui.item.name)
                classInstance.viewModelLeads.data.locality(ui.item.location.locality)
                classInstance.viewModelLeads.data.projectId(ui.item.id)
                return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div></a>" ).appendTo(ul);
      };  
    ko.applyBindings(classInstance.viewModelLeads,document.getElementById(classInstance.postReqLeads))
 
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
Common.prototype.captureLeads = function() {
	var classInstance = this;
	httpUtils.post("/capture-lead",
		classInstance.viewModelLeads.data,
		 { },"JSON",function(data){
		if(data.status==0){
	       alert(1)
		}else {
			
		}
	})
};	
