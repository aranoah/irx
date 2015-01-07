
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
	 ko.applyBindings(classInstance.viewModel,document.getElementById("login-box"));
};
Common.prototype.login = function() {
	var classInstance = this;
	httpUtils.post("/login",{userId:classInstance.viewModel.userId,password:classInstance.viewModel.password},
		 { 'authorization': 'POST' },"JSON",function(data){
		if(data.status==0){
	      location.reload();
		}else {
			
		}
	})
};		 
