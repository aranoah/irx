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
var STATUS = CONSTANTS.him_status;
var defPage = CONSTANTS.def_page;
var MAIL_TYPE = CONSTANTS.MAIL_TYPE;
var IRXProductLineModel = require(_path_model+"/IRXProductLine");

var mongoose = require('mongoose');
var IRXAgentMProductModel = require(_path_model+"/IRXAgentMProduct");
var properties = require(_path_env+"/properties.js");
var baseService = require(_path_service+"/base/baseService");
var IRXLeadModel = require(_path_model+"/IRXLead");
var IRXLeadReviewModel = require(_path_model+"/IRXLeadReview");
var mongoose = require('mongoose');
var userService = require(_path_service+"/userService.js" )

function LeadService(){    
	baseService.call(this);
}
LeadService.prototype.__proto__=baseService.prototype ;

/*
*	Get Project Details
*
**/
LeadService.prototype.captureLeads = function(data) {
	console.log("In captureLeads")
	var _selfInstance = this;
	_selfInstance.once("saveLeadEvent",function(){
 	
	 // Make a database entry
	var id = _selfInstance.getCustomMongoId("IL")

		var leadData = new IRXLeadModel({
				"id":id,
	  			"projectId": data.projectId,
	   			"agentId": data.dealerId,
	   			"name": data.name,
	   			"propertyType":data.propertyType,
	   			"bhk":data.bhk,
	   			"action":data.action,
	   			"origin":data.origin,
	   			"mobileNo":data.mobileNo,
	   			"emailId": data.emailId,
	   			"irxId" : data.irxId,
	   			"type": data.type,
	   			"createdOn": new Date(),
	   			"projectName":data.proName,
	   			"status":CONSTANTS.him_constants.USER_STATUS.PENDING_VERFICATION
		});
		leadData.save(function(err, savedData) {
		if (err) {
			console.log(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
			
			} else {
				if(savedData){
					var password =  _selfInstance.getCustomMongoId("P");
					var qObj = {
						"action":MAIL_TYPE.LEAD,
						"data" : savedData.id,
						"password" :password
					}
					_app_context.sqs.sendMessage({
                		"QueueUrl" : _app_context.qUrl,
                		"MessageBody" : JSON.stringify(qObj)

             			 }, function(err, data){                
             		});
					if(data.createLogin && data.createLogin=="true"){
						
                		var userSvc = new userService();
                		
                		userSvc.registerUser({"emailId":data.emailId,"name":data.name,"password":password,type:data.type});
                		return;
                	}
                	
					_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.msg,savedData,null);
				} else{
					_selfInstance.emit("done",STATUS.SERVER_ERROR.code,"Error saving verification",err,null);
				}
			}
		})
	}) 
	_selfInstance.once("checkUserEvent",function(){
 		
	 	IRXUserProfileModel.findOne({"irxId":data.dealerId},{"irxId":1},function(err,agents){
	 		
	 		if(err){
	 			console.error(err);
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			}else {
				if(agents && agents != null){
					_selfInstance.emit("saveLeadEvent")
				} else {
					console.error("No agents found")
		 			_selfInstance.emit("done",404,"No agents found",null,null);
				}
				
			}
	 	})
		
	}) 

	// check for valid Project
	IRXProductLineModel.findOne({"id":data.projectId},{"id":1},function(err,project){
		if(err){
			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		} else {
			if(project== null){
				console.error("No project found")
		 		_selfInstance.emit("done",404,"No project found",null,null);
			}else if(data.dealerId && data.dealerId != ""){
				_selfInstance.emit("checkUserEvent")	
			}else{
				_selfInstance.emit("saveLeadEvent")
			}
			
		}
	})

};


/*
* Review Lead Verify
*/

LeadService.prototype.reviewLeadVerify = function(data) {
	console.log("In reviewLead")
	var _selfInstance = this;
	IRXLeadReviewModel.findOne({ 'id': data.leadId }, function (err, review) {
 		if (err){
 			console.error(err)
 			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,null);
 			
 		} else{

 			if(review && review != null){
 				// Save Lead
 				review['reviewedBy']=data.userId;
 				review['status']=CONSTANTS.him_constants.USER_STATUS.VERIFIED;
 				review['updatedOn']=new Date();

 				var lead = new IRXLeadModel(review);
 				lead.save(function(err,lead){
 					if (err) {
						console.log(err)
						_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving lead",err,null);
						
						} else {
							if(lead){
								_selfInstance.reviewLeadDelete(data)
							} else{
								_selfInstance.emit("done",STATUS.SERVER_ERROR.code,"Error saving Lead",err,null);
							}
						}
 				})
 			} else{
 				console.log("Verification data not matched")
				_selfInstance.emit("done",500,"Verification data not matched","Verification data not matched",null);
 			}
 			
  		}
  		
	})
};

/*
* List Lead // Add criteria
*/

LeadService.prototype.listLeads = function(data) {
	console.log("In listLead")
	var _selfInstance = this;
	var page = data.page;
	
	if(!page){
		page=defPage
	}

 	var start = page.start;

	var pageSize = Number(page.pageSize)+1;
	
	IRXLeadModel.find({},{},{skip:start,limit:pageSize},function(err , result){
		if(err){
			console.error(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else{
			if(data != null){
				_selfInstance.processPagenation(result,page)
				_selfInstance.emit("done",STATUS.OK.code,STATUS.OK.code.msg,result,page);
			}
			else {
				console.log("Lead data not found")
				_selfInstance.emit("done",404,"Lead data not found","Lead data not found",null);
			 			
			}
		}
	})
};
module.exports = LeadService;