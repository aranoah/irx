
function Common() {
	this.postReqLeads="post";
	this.sellPostLeads="sell";
  this.postReqLeadsA = "_postA_";
  this.agentIdArr = [];
  this.viewModelPost=null;
  this.aPostReqViewModel = null;
}
Common.prototype.getViewModel = function(type) {
	var classInstance = this;
	  var viewModel = {
      data:{
      	emailId:ko.observable(""),
      	projectId:ko.observable(""),
      	agentId:ko.observableArray(),
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
        alert(2)
      	classInstance.captureLeads(type);
      },
      removeAgent:function(data){
        //alert(2)
        viewModel.data.agentId.remove(data)
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
    emailId: ko.observable(''),
    password : ko.observable(''),
    type :ko.observable(''),
    name :ko.observable(''),
    register : function() {
       classInstance.register();
    },
		openTab:function(tabID) {
			classInstance.viewModel.tabID(tabID);
			return false;
		},
		login : function() {
           classInstance.login();
        }

	};
	
   $('#login').on('change','._type_', function(){
      classInstance.viewModel.type($(this).val())
   })
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
       $("#"+classInstance.postReqLeadsA).find("#__postReqSearch").autocomplete({

            source: function(request, response){
                var _self = this;
               
                  sBar.projectAutocomplete(request.term,request,response)
                
              },
              minLength: 2,
              dataType: "json",
              cache: false,
              appendTo:'#autoDivPostA',
              select: function( event, ui ) {

                classInstance.aPostReqViewModel.data.proName(ui.item.name)
                classInstance.aPostReqViewModel.data.locality(ui.item.location.locality)
                classInstance.aPostReqViewModel.data.projectId(ui.item.id)
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
 // ko.applyBindings(classInstance.viewModel,document.getElementById("login"));


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
Common.prototype.register = function() {
  var classInstance = this;
  httpUtils.post("/create-user",
    {
      emailId:classInstance.viewModel.emailId,
      password:classInstance.viewModel.password,
      name:classInstance.viewModel.name, 
      type:classInstance.viewModel.type
    },
     {  },"JSON",function(data){
    if(data.status==0){
        alert(1)
    }else {
      
    }
  })
};  
Common.prototype.captureLeads = function(type) {
	var classInstance = this;
	var viewModel = null;
  alert(3)
	if(type == classInstance.postReqLeads){
		viewModel = classInstance.viewModelPost;
	} else if(type == classInstance.sellPostLeads){
		viewModel = classInstance.viewModelSell;
	}else{
    alert(1)
    console.log(viewModel)
    viewModel = classInstance.aPostReqViewModel;
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
var common =null;
$(document).ready(function(){
  if(common == null){
   common = new Common();
   common.init();
  }
})
 