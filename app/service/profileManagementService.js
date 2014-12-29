/***********************************************************************
*
* DESCRIPTION :
*       Service class for profile management functionalities
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
var CONSTANTS = require(_path_util+'/constants');
var mongoErr = require(_path_util+'/mongo-error')
var STATUS = CONSTANTS.him_status;
var hashAlgo = require(_path_util+"/sha1.js");
var defPage = CONSTANTS.def_page;
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var IRXUserProfileModel = require(_path_model+"/IRXUser");
var IRXProductLineModel = require(_path_model+"/IRXProductLine");
var emailUtils = require(_path_util+"/email-utils.js");
var emailTemplates = require('email-templates');

var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");

var mongoose = require('mongoose');
function PMService(){    
	baseService.call(this);
}
PMService.prototype.__proto__=baseService.prototype ;

/**
*   Associate a project to agent
*/
PMService.prototype.associateProject = function(data) {
 var _selfInstance = this;
 var userId = data.userId;
 var projectId = data.projectId;
 this.once("stage2",function(project){
 	mongoose.getCollection('irxagentmproducts').findAndModify(
 		{"agent":userId},
 		[],
		{$addToSet:{"project":projectId}},
		{upsert:true,"new":false },
			function(err, mapping){
				
				if(err){
					console.error(err)
					_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
				} else {
					var update = false;
					if(mapping ==null ){
						update = true;
					} else if(mapping !=null && mapping.project.indexOf(projectId)==-1){
						update = true;
					} else{
						_selfInstance.emit("done",STATUS.NO_UPDATION.code,STATUS.NO_UPDATION.msg,err,null);
					}
					if(update){
						//update user
						IRXUserProfileModel.update({"irxId":userId},
							{$inc:{"projectCounter":1}},
							function(err,numberAffected,raw){
								if(err){
									console.error("projectCount in user not updated. Error :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
								} else {
									if(numberAffected>0){
										console.log("projectCount has been udated");
									}else{
										console.error("projectCount in user not updated. ");
									}
								}
							}
							)
						//update project
							IRXProductLineModel.update({"id":projectId},
							{$inc:{"agentCounter":1}},
							function(err,numberAffected,raw){
								if(err){
									console.error("agentCounter in user not updated. Error :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
								} else {
									if(numberAffected>0){
										console.log("agentCounter has been udated");
									}else{
										console.error("agentCounter in user not updated. ");
									}
								}
							}
							)
						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,project,null);	
					}
					
				}	
			}
 	
	)
  })
 
  this.once("stage1",function(){
 	/*
 	* Check Valid project
 	*/
 	IRXProductLineModel.findOne({"id":projectId},function(err,project){
 		if(err){
 			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else {
			if(project && project != null){
				_selfInstance.emit('stage2',project);	
			} else {
				console.error("No project found")
	 			_selfInstance.emit("done",404,"No project found",null,null);
			}
			
		}
 	})
	
 }) 
 

/*
* Check valid agent
*/
IRXUserProfileModel.findOne({"irxId":userId,"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED,"type":"agent"},
	function(err,data){
		if(err){
			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		} else {
			if(data && data != null){
				_selfInstance.emit('stage1');	
			} else {
				console.error("No User found")
	 			_selfInstance.emit("done",404,"No User found",null,null);
			}
		}
	})
	
	
};

/**
*   Delete a project from agent
*/
PMService.prototype.deleteProject = function(data) {
 var _selfInstance = this;
 var userId = data.userId;
 var projectId = data.projectId;
 this.once("delProStage2",function(project){
 	mongoose.getCollection('irxagentmproducts').findAndModify(
 		{"agent":userId},
 		[],
		{$pull:{"project":projectId}},
		{"new":true },
			function(err, mapping){
				
				if(err){
					console.error(err)
					_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
				} else {
					
					var update = false;
					if(mapping !=null && mapping.project.indexOf(projectId)==-1){
						update = true;
					} else{
						_selfInstance.emit("done",STATUS.NO_UPDATION.code,STATUS.NO_UPDATION.msg,err,null);
					}
					if(update){
						//update user
						IRXUserProfileModel.update({"irxId":userId,"projectCounter":{$gt:1}},
							{$inc:{"projectCounter":-1}},
							function(err,numberAffected,raw){
								if(err){
									console.error("projectCount in user not updated. Error :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
								} else {
									if(numberAffected>0){
										console.log("projectCount has been udated");
									}else{
										console.error("projectCount in user not updated. ");
									}
								}
							}
							)
						//update project
							IRXProductLineModel.update({"id":projectId,"agentCounter":{$gt:1}},
							{$inc:{"agentCounter":-1}},
							function(err,numberAffected,raw){
								if(err){
									console.error("agentCounter in user not updated. Error :- ",mongoErr.resolveError(err.code).code +","+mongoErr.resolveError(err.code).msg)
								} else {
									if(numberAffected>0){
										console.log("agentCounter has been udated");
									}else{
										console.error("agentCounter in project not updated. ");
									}
								}
							}
							)
						_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,project,null);	
					}
					
				}	
			}
 	
	)
  })
 
  this.once("delProStage1",function(){
 	/*
 	* Check Valid project
 	*/
 	IRXProductLineModel.findOne({"id":projectId},function(err,project){
 		if(err){
 			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else {
			if(project && project != null){
				_selfInstance.emit('delProStage2',project);	
			} else {
				console.error("No project found")
	 			_selfInstance.emit("done",404,"No project found",null,null);
			}
			
		}
 	})
	
 }) 
 

/*
* Check valid agent
*/
IRXUserProfileModel.findOne({"irxId":userId,"status":CONSTANTS.him_constants.USER_STATUS.VERIFIED,"type":"agent"},
	function(err,data){
		if(err){
			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		} else {
			if(data && data != null){
				_selfInstance.emit('delProStage1');	
			} else {
				console.error("No User found")
	 			_selfInstance.emit("done",404,"No User found",null,null);
			}
		}
	})
	
	
};
/**
*   List project for association to agents  projectAutocomplete
*/
PMService.prototype.listProject = function(page) {
	var _selfInstance = this;
	if(!page){
		page=defPage;
	}

	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	IRXProductLineModel.find({},{},{skip:start,limit:pageSize },
		function(err,projectDetails){
			if(err){
				console.log(err)
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			} else {
				_selfInstance.processPagenation(projectDetails,page)
				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,projectDetails,page);			
			}	
	})
}

/**
*   Project autocomplete
*/
PMService.prototype.projectAutocomplete = function(data) {
	var _selfInstance = this;
	var page = data.page;
	if(!page){
		page=defPage 
	}
	var start = page.start;
	var pageSize = Number(page.pageSize)+1;
	IRXProductLineModel.find({ "name": { $regex: "^"+data.str+"*", $options: 'i' } },{},{skip:start,limit:pageSize },
		function(err,projectDetails){
			if(err){
				console.log(err)
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			} else {
				_selfInstance.processPagenation(projectDetails,page)
				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,projectDetails,page);			
			}	
	})
}

/**
*  Mark Distress
*/
PMService.prototype.markDistress = function(data) {
	
}
module.exports = PMService;