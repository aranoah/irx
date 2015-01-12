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
*		16 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var projdetController = new Controller();

var commonValidator = require(_path_util+"/commonValidator")

/*
* 	Project-Detailing page 
*	@TODO : Server integration still pending
**/


projdetController.main = function() {
  console.log("In main Method")
  this.title = "Project-Detailing page";
  this.render("irx/projdet"); 
 
}
module.exports = projdetController;