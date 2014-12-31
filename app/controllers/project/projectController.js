/***********************************************************************
*
* DESCRIPTION :
*       Controller for project related services
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
var projectController = new Controller();
var projectService = require(_path_service+"/projectService.js" )



/*
* 	Project page 
*	@TODO : Server integration still pending
**/


projectController.main = function() {
  console.log("In main Method")
 var projSvc = new projectService();
 
    var _nself = this;
    
    projSvc.on("done", function(code,msg,result,errValue){
     _nself.result=result;
     _nself.title = "project";
     _nself.projectId = _nself.req.params.projectId;
  		_nself.render("profile/public"); 
    });
   projectId= _nself.req.params.projectId;
    projSvc.getUserDetails(projectId);
  	

}
module.exports = projectController;