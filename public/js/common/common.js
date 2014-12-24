
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
	}
	 ko.applyBindings(classInstance.viewModel,$('#login'));
};
Common.prototype.login = function() {
	var classInstance = this;
	httpUtils.post("/login",{userId:classInstance.viewModel.userId,password:classInstance.viewModel.password},
		"JSON",function(data){
		if(data.status==0){
	      alert(1)
		}
	})
};		 
$(document).ready(function(){
	  
	var common = new Common();
	common.init();
})