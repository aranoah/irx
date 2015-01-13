
function Common() {

}

Common.prototype.init = function(first_argument) {

	var classInstance = this;
	classInstance.viewModel = {
		userId: ko.observableArray(),
		password: ko.observable(),
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
      	type:ko.observable("")
      },
      captureLeads:function(){
      	classInstance.captureLeads();
      }
    };
    $("#__postReqSearch").autocomplete({

            source: function(request, response){
                var _self = this;
               
                  sBar.projectAutocomplete(request.term,request,response)
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivPost',
              select: function( event, ui ) {
                  $('#__postReqSearch').val(ui.item.id)
                  classInstance.viewModelLeads.data.projectId(ui.item.id)
                   return false;
              }
    }).data( "ui-autocomplete" )._renderItem = function( ul, item ) {
        $(".ui-widget-content .ui-state-focus");
         return $( "<li>" ).append( "<a><div class='itLabel'>"+item.name+"</div></a>" ).appendTo(ul);
      };  
    ko.applyBindings(classInstance.viewModelLeads,document.getElementById("post"))
 
	ko.applyBindings(classInstance.viewModel,document.getElementById("login-box"));
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