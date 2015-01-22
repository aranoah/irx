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
*		22 Jan 2015
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var termsController = new Controller();



/*
* 	t&c page 
*	@TODO : Server integration still pending
**/


termsController.main = function() {
  console.log("In main Method for t&c page")
  this.title = "contact us page";
  this.render("irxmisc/terms"); 
}
module.exports = termsController;