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
*		15 JAN 2015
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var homeController = new Controller();



/*
* 	Homepage 
*	@TODO : Server integration still pending
**/


homeController.main = function() {
  console.log("In main Method for Homepage")
  this.title = "Homepage";
  this.requestObj = this.req.query;
  this.render("irx/home"); 
}
module.exports = homeController;