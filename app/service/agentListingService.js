/***********************************************************************
*
* DESCRIPTION :
*       Service class for agent listing related functionalities
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
var CONSTANTS = require(_path_util+'/constants');
var mongoErr = require(_path_util+'/mongo-error')
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXVerificationModel = require(_path_model+"/IRXVerification");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');

var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");

var mongoose = require('mongoose');
function AgentListingService(){    
	baseService.call(this);
}
AgentListingService.prototype.__proto__=baseService.prototype ;

AgentListingService.prototype.listAgents = function(data){

	var query = {};
	
	if(data.city != null) {
		query["location.city"]=data.city;
	}
	if(data.type != null) {
		query["type"]=data.type;
	}
	if(data.bhk != null) {
		query["bhk"]=data.bhk;
	}
	if(data.budget != null) {
		query["price"]=data.budget;
	}
	IRXProductLineModel.find(query,{"_id":1},page,function(err , result){
		if(err){
			console.error(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else{
			if(data != null){
				for (var i=0 ; i<data.length;i++) {

				    var projectLocations = new ObjectId(data[i]._id);
				    var projectIds = new Array();
			 				for (var i=0 ; i<projectList.length;i++) {

							    projectId = new ObjectId(projectList[i]);
							    console.log(projectId)
							    projectIds.push(projectId)
							}
							var start = page.start;
							var pageSize = Number(page.pageSize)+1;
				}
			} else {

			}
		}
	})
}
module.exports = AgentListingService;