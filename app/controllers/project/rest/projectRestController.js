/***********************************************************************
*
* DESCRIPTION :
*        Controller for project related services
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		27 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var projectRestController = new Controller();

var projectService = require(_path_service+"/projectService.js" )

projectRestController.listPreferedAgents = function() {
	var projService = new projectService();
	
    var _nself = this;
    projService.on("done", function(code,msg,err,errValue,extra){
     _nself.processJson(code,msg,err,errValue,extra);
    });
   
    var data = {
        "projectId":_nself.req.params.projectId,
        "location":_nself.req.query.location,
        "city":_nself.req.query.city
    }
    projService.listPreferedAgents(data);
};
projectRestController.getProjectDetails = function() {
    var projService = new projectService();
    
    var _nself = this;
    projService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    projService.getProjectDetails(_nself.req.params.projectId,true);
};

projectRestController.requestDetails = function() {
    var projService = new projectService();
    
    var _nself = this;
    projService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var agentId = _nself.getCurrentUserInfo(_nself).userId;
    var data ={
        "projectId": _nself.req.params.projectId,
        "userId" : agentId
    };

    projService.requestDetails(data);
};
module.exports=projectRestController