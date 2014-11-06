var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants')
var restController = new Controller();


restController.validate_main=function(){
    /// this.req = request object, this.res = response object.
    console.log("inside validate");
    this.req.checkBody('email', 'Invalid email').notEmpty();    
    return false;
}


restController.main = function() {
	/*** if validation applied for this method then call use handle validation**/

	var errors = this.req.validationErrors();
	if (errors) {
		console.log(errors);
		this.processJson(400,"error",errors,null);
    	return;
  	}

  	this.title = 'Locomotive';
  	this.err="";
  	this.processJson(0,"msg","result",null);
}

module.exports = restController;
