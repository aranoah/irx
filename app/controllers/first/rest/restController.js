var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants')
var restController = new Controller();


restController.validate_main=function(){
    /// this.req = request object, this.res = response object.

    this.addHError("f1","error msg");
    return false;
}


restController.main = function() {
	/*** if validation applied for this method then call use handle validation**/
if( this.handleValidationErr(false)){
   return;  
}

  this.title = 'Locomotive';
  this.err="";
  this.processJson(0,"msg","result",null);
}

module.exports = restController;
