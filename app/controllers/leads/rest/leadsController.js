/***********************************************************************
*
* DESCRIPTION :
*       Controller for leads related services
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
var leadsController = new Controller();
var leadService = require(_path_service+"/leadService.js" )
var commonValidator = require(_path_util+"/commonValidator")


/*
* Validate function for user registration
*/
leadsController.validate_captureLeads=function(){
      var myvalidator = new commonValidator(this.req);
    /// this.req = request object, this.res = response object.
    console.log("inside validate",this.req.body.emailId);
    
    var validateEmail = ["required","isEmail"];
    myvalidator.validate("emailId",validateEmail,this.req.body.emailId);

    var validateName = ["required"];
    myvalidator.validate("name",validateName,this.req.body.name);
    
    var validateAgentId = ["required"];
    myvalidator.validate("AgentId",validateAgentId,this.req.body.agentId);

    var validateProjectId = ["required"];
    myvalidator.validate("ProjectId",validateProjectId,this.req.body.prjectId);

     var validateMobileNo = ["required"];
    myvalidator.validate("mobileNo",validateMobileNo,this.req.body.mobileNo);
    
    console.log(myvalidator.getErrors())
}

/*
* 	capture leads 
**/

leadsController.captureLeads = function() {
 var lService = new leadService();
  //Validation
    if(this.req.errors.hasError()){
       this.processJson(403,"validation error",this.req.errors.getErrors());
       return;
    }
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    lService.captureLeads(_nself.req.body);
}

/*
*   Verify leads 
**/
leadsController.reviewLeadVerify = function() {
 var lService = new leadService();
  
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var data = {
      "userId":_nself.req.session['X-CS-Auth'].userId,
      "leadId":_nself.req.params.leadId
    }
    lService.reviewLeadVerify(data);
}

/*
*   Delete leads 
**/
leadsController.reviewLeadDelete = function() {
 var lService = new leadService();
  
    var _nself = this;
    lService.on("done", function(code,msg,err,errValue){
     _nself.processJson(code,msg,err,errValue);
    });
    var data = {
      "userId":_nself.req.session['X-CS-Auth'].userId,
      "leadId":_nself.req.params.leadId
    }
    lService.reviewLeadDelete(data);
}
module.exports = leadsController;

/*
*   List leads 
**/
leadsController.listLeads = function() {
  var lService = new leadService();
  console.log("Leadsssss...")
  var _nself = this;
  lService.on("done", function(code,msg,err,errValue){
   _nself.processJson(code,msg,err,errValue);
  });
  var data = {
    "userId":_nself.req.session['X-CS-Auth'].userId,
    page:_nself.req.params.page
  }
  lService.listLeads(data);
}
module.exports = leadsController;