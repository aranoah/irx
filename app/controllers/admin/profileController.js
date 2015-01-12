/***********************************************************************
*
* DESCRIPTION :
*       Test controller for user related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Raghu (raghavendra@aranoah.com)      
*
* START DATE :    
*		3 JAN 2015
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var profileController = new Controller();
var userService = require(_path_service+"/userService.js" )


/*
* 	Admin-Profile page 
*	@TODO : Server integration still pending
**/


profileController.main = function() {
  
  
   var userSvc = new userService();
 
    var _nself = this;
    
    userSvc.on("done", function(code,msg,result,errValue){
    	_nself.title = "Admin-Profile page";
    	_nself.result=result;
     	_nself.userId = _nself.req.params.userId;
  		_nself.render("admin/profile"); 
    	
  		
    });
   userId= _nself.req.params.userId;
    userSvc.getUserDetails(userId);
}
module.exports = profileController;