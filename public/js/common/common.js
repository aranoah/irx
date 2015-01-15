
function Common() {

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
	}
	 ko.applyBindings(classInstance.viewModel,document.getElementById("login"));
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
