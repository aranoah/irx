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
var commonValidator = require(_path_util+"/commonValidator")
var pMController = new Controller();

var profileManagementService = require(_path_service+"/profileManagementService.js" )

pMController.validate_resetPassword=function(){
    var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate reset password");

    var validateEPassword = ["required"];
    myvalidator.validate("ePassword",validateEPassword,this.req.query.ePassword);

    var validateNPassword = ["required"];
    myvalidator.validate("nPassword",validateNPassword,this.req.query.nPassword);

    console.log(myvalidator.getErrors())
}
/**
*   Associate a project to agent
*/

pMController.associateProject = function() {
 
     var _nself = this;
	 var user = _nself.getCurrentUserInfo(_nself);
   console.log(user)
    var pMService = new profileManagementService();
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
    	userId:user.irxId,
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
      var user = _nself.getCurrentUserInfo(_nself);
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
        userId:user.irxId,
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
/**
*   Associate a location to agent
*/

pMController.associateLocation = function() {
    var pMService = new profileManagementService();
     var _nself = this;
       var user = _nself.getCurrentUserInfo(_nself);
   
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
        userId:user.irxId,
        projectId:_nself.req.params.projectId
    }
    
    pMService.associateLocation(data);
};

/**
*   Delete a location from agent's associated projects
*/

pMController.deleteLocation = function() {
    var pMService = new profileManagementService();
   
    var _nself = this;
       var user = _nself.getCurrentUserInfo(_nself);
    pMService.on("done", function(code,msg,result,errValue){
     _nself.processJson(code,msg,result,errValue);
    });
    var data = {
        userId:user.irxId,
        projectId:_nself.req.params.projectId
    }
    
    pMService.deleteLocation(data);
};

pMController.resetPassword = function() {
   var pMService = new profileManagementService();

    var _nself = this;
    pMService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
      var user = _nself.getCurrentUserInfo(_nself);
    var data={
      "userId":user.irxId,
      "password":_nself.req.query.ePassword,
      "newPassword":_nself.req.query.nPassword,
    }

    pMService.resetPassword(data);
}

module.exports=pMController