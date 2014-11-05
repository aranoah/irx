var Controller = require('../base/baseController')
var pagesController = new Controller();


pagesController.validate_main=function(){
    /// this.req = request object, this.res = response object.

    this.addHError("f1","error msg");
    return false;
}


pagesController.mainJson = function() {
	/*** if validation applied for this method then call use handle validation**/
if( this.handleValidationErr(false)){
   return;  
}

  this.title = 'Locomotive';
  this.err="";
  this.render('pages/main');
}

pagesController.mainUi = function() {
	/*** if validation applied for this method then call use handle validation**/
if( this.handleValidationErr(true)){
   return;  
}

  this.title = 'Locomotive';
  this.err="";
  this.render('pages/main');
}



module.exports = pagesController;
