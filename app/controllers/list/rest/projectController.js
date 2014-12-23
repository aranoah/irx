/***********************************************************************
*
* DESCRIPTION :
*       Agent controller for listing agents
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		17 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var projectController = new Controller();

var projectListingService = require(_path_service+"/projectListingService.js" )

projectController.listProjects = function() {
	var projectListService = new projectListingService();
	
    var _nself = this;
    projectListService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userFilters = {
    	filters:_nself.req.params.filters,
    	page:_nself.req.params.page
    }
    console.log(userFilters)
    projectListService.listProjects(_nself.req.body);
};
module.exports=projectController