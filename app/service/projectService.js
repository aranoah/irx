/***********************************************************************
*
* DESCRIPTION :
*       Service class for project related functionalities
*  
* Copyright :
*		Aranoah Technologies Pvt Ltd 2014.  All rights reserved.
* 
* AUTHOR :    
*		Puneet (puneet@aranoah.com)      
*
* START DATE :    
*		27 Nov 2014
*
* CHANGES :
*
**/
var CONSTANTS = require(_path_util+'/constants');
var mongoErr = require(_path_util+'/mongo-error')
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var STATUS = CONSTANTS.him_status;

var defPage = CONSTANTS.def_page;
var IRXProductLineModel = require(_path_model+"/IRXProductLine");

var mongoose = require('mongoose');
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");
var IRXUserProfileModel = require(_path_model+"/IRXUser");

var mongoose = require('mongoose');
function ProjectService(){    
	baseService.call(this);
}
ProjectService.prototype.__proto__=baseService.prototype ;

/*
*	Get Project Details
*
**/
ProjectService.prototype.getProjectDetails = function(projectId) {
	console.log("In getProjectDetails")
	var _selfInstance = this;
	var Project = IRXProductLineModel;
	var id = projectId;
	
	Project.findOne({"id":id},
				function(err,data){
					if (err){
			 			console.error(err)
			 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			 			
			 		} else{

			 			if(data && data != null){
			 				
			 				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,data,null);
			 				
			 			} else{
			 				console.log("Project data not found")
							_selfInstance.emit("done",404,"Project data not found","Project data not found",null);
			 			}
			 			
			  		}
				})
	
}

/*
*	List Preferred agents
*
**/
ProjectService.prototype.listPreferedAgents = function(data) {
	console.log("In listPreferedAgents")
	var projectId = data.projectId;
	var _selfInstance = this;
	var Mapping = IRXAgentMProductModel;
	var id = projectId;
	var city =data.city;
	this.once("listPrefStage1",function(agentIds,retCity){
 	
	 	IRXUserProfileModel.find({"irxId":{$in:agentIds}},{'name': 1,'companyName':1,'location':1,"projects":1,"locationProjects":1,"imageUrl":1,"irxId":1},function(err,agents){
	 		
	 		if(err){
	 			console.error(err);
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			}else {
				if(agents && agents != null){
					if(retCity){

						IRXProductLineModel.findOne({"id":id},{"location":1},
								function(err,pData){
									if (err){
							 			console.error(err)
							 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
							 			
							 		} else{
							 			
							 			if(pData && pData != null){
							 				var extra ={};
								 			if(pData.location){
								 			  extra.city = pData.location.city
								 			}
							 			
							 			_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,agents,null,extra);
							 				
							 			} else{
							 				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,agents,null);
							 			}
							 			
							  		}
								})
						}else{
							_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,agents,null);
						}
					
				} else {
					console.error("No agents found")
		 			_selfInstance.emit("done",404,"No agents found",null,null);
				}
				
			}
	 	})
		
	}) 
	var query ={"project":id};
	var retCity = false;
	if(data.location && data.location == 'true'){
		query={"location":id}
		retCity =true;
	}
	Mapping.find(query,{"agentId":1},{skip:0,limit:4 },
					function(err,mapping){
						if(err){
							console.log(err)
							_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
						
						} else{
						
							if(mapping && mapping != null && mapping.length>0){
								
								var agentIds = new Array();
								for(var i=0;i<mapping.length;i++){
									agentIds.push(mapping[i].agentId);
								}
								_selfInstance.emit('listPrefStage1',agentIds,retCity);		
							} else {
								console.log("No prefered agent found")
								_selfInstance.emit("done",404,"No prefered agent found","No prefered agent found",null);
			 				}
						}
					})



}

/* Request Details of a project . Sends a mail with the url of project details*/

ProjectService.prototype.requestDetails = function(data){
			var _selfInstance= this;

			var qObj = {
				"action":MAIL_TYPE.PROJECT_DETAILS,
				"data" : data
			}
			var strQObj = JSON.stringify(qObj)
			
			_app_context.sqs.sendMessage({
	        	"QueueUrl" : _app_context.qUrl,
	        	"MessageBody" : strQObj
	     	 }, function(err, data){ 
	     	      if(err){
	     	      	console.log("Error putting in queue")
	     	      	_selfInstance.emit("done",STATUS.ERROR.code,"Error putting in queue",null,null);
	     	    
					return;
	     	      } else{
	     	      	console.log("Successfully queued")
	     	      	_selfInstance.emit("done",STATUS.OK.code,"Successfully queued",null,null);
					return;
	     	      }         
	      });	
}

module.exports = ProjectService;