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
var agentController = new Controller();

var agentListingService = require(_path_service+"/agentListingService.js" )

agentController.listAgents = function() {
	var agentListService = new agentListingService();
	
    var _nself = this;
    agentListService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var userFilters = {
    	filters:_nself.req.params.filters,
    	page:_nself.req.params.page
    }
    
    agentListService.listAgents(_nself.req.body);
};
module.exports=agentController