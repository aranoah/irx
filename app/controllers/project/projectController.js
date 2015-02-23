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
  		_nself.render("irx/projdet",{getPriceText:getPriceText}); 
    });
    projectId= _nself.req.params.projectId;
    projSvc.getProjectDetails(projectId);
 
}
function getPriceText (amount) {
  amount=""+amount;
  var text = "";
  if(amount.length==4 || amount.length==5){
      amount = Number(amount)/1000;
      text = amount+"K";
    } else if(amount.length==6 || amount.length==7){
      amount = Number(amount)/100000;
      text = amount+"Lac";
    } else if(amount.length>=8){
      amount = Number(amount)/10000000;
      text = amount+"Cr";
    } else {
      text = amount
    }
    return text;
};
module.exports = projectController;