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
*		12 Jan 2015
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var noResultController = new Controller();



/*
* 	No result page 
*	@TODO : Server integration still pending
**/


noResultController.main = function() {
  console.log("In main Method for No result page")
  this.title = "No result page";
  this.render("irx/404"); 
}
module.exports = noResultController;