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
*		09 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var publicController = new Controller();
var userService = require(_path_service+"/userService.js" )



/*
* 	Public profile page 
*	@TODO : Server integration still pending
**/


publicController.main = function() {
  console.log("In main Method")
 var userSvc = new userService();
 
    var _nself = this;
    
    userSvc.on("done", function(code,msg,result,errValue){
     _nself.result=result;
     _nself.title = "profile";
     _nself.userId = _nself.req.params.userId;
  		_nself.render("profile/public"); 
    });
   userId= _nself.req.params.userId;
    userSvc.getUserDetails(userId);
  	

}
module.exports = publicController;