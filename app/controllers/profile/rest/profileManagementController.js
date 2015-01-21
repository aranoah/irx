/***********************************************************************
*
* DESCRIPTION :
*       Controller for profile management
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		20 Dec 2014
*
* CHANGES :
*
**/
var Controller = require(_path_cntlr+'/base/baseController');
var CONSTANTS = require(_path_util+'/constants');
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js")
var commonValidator = require(_path_util+"/commonValidator")
var pMController = new Controller();

var profileManagementService = require(_path_service+"/profileManagementService.js" )

/**
*   Associate a project to agent
*/

pMController.associateProject = function() {
	var pMService = new profileManagementService();
     var _nself = this;
	 var userId = _nself.getCurrentUser(_nself);
   
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
    	userId:userId,
    	projectId:_nself.req.params.projectId
    }
    
    pMService.associateProject(data);
};

/**
*   Delete a project from agent's associated projects
*/

pMController.deleteProject = function() {
    var pMService = new profileManagementService();
   
    var _nself = this;
     var userId = _nself.getCurrentUser(_nself);
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
        userId:userId,
        projectId:_nself.req.params.projectId
    }
    
    pMService.deleteProject(data);
};

/**
*  List projects for association
*/

pMController.listProject = function() {
    var pMService = new profileManagementService();
    
    var _nself = this;
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var page = _nself.req.body.page;
    var type = _nself.req.params.type;

    var data= {
        "page":page,
        "type":type
    }
    pMService.listProject(data);
};


/**
*  Project autocomplete
*/

pMController.projectAutocomplete = function() {
    var pMService = new profileManagementService();
    
    var _nself = this;
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data={
        "page" : _nself.req.query.page,
        "str" : _nself.req.query.str,
        "type" : _nself.req.params.type
    }
   
    pMService.projectAutocomplete(data);
};

/**
* Mark disterss
*/

pMController.markDistress = function() {
    var _nself = this;
    var pMService = new profileManagementService();
    var distress = _nself.req.body; 
    
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    

    var userId = "";
    if(_nself.req.session['X-CS-Auth']){
        if(_nself.req.session['X-CS-Auth'].user){
          userId =_nself.req.session['X-CS-Auth'].user.irxId;
        }
      }
      var data={};
    data.projectId = _nself.req.params.projectId;
    data.irxId = userId
    data.distress = distress;
    pMService.markDistress(data);
};
module.exports=pMController