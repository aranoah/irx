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
var aboutusController = new Controller();



/*
* 	contact us page 
*	@TODO : Server integration still pending
**/


aboutusController.main = function() {
  console.log("In main Method for aboutus page")
  this.title = "about us page";
  this.render("irxmisc/aboutus"); 
}
module.exports = aboutusController;