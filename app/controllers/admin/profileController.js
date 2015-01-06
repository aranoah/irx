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



/*
* 	Admin-Profile page 
*	@TODO : Server integration still pending
**/


profileController.main = function() {
  console.log("In main Method")
  this.title = "Admin-Profile page";
  this.render("admin/profile"); 
}
module.exports = profileController;