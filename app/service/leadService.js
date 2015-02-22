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
	 this.leadType={
		post:"post",
		sell:"sell"
	}
}
LeadService.prototype.__proto__=baseService.prototype ;

/*
*	Get Project Details
*
**/
LeadService.prototype.captureLeads = function(data) {
	console.log("In captureLeads")
	var _selfInstance = this;
	_selfInstance.once("saveLeadEvent",function(project){
 	
	 // Make a database entry
	var id = _selfInstance.getCustomMongoId("IL")
		var localityId = ""
		if(project.location){
			localityId = project.location.locality;
		}
		var locality=""
		if(project.location){
			locality = project.location.name;
		}
		
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
	   			"status":CONSTANTS.him_constants.USER_STATUS.PENDING_VERFICATION,
	   			"localityId":localityId,
	   			"locality":locality
		});
		leadData.save(function(err, savedData) {
		if (err) {
			console.log(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,"Error saving user information",err,null);
			
			} else {
				if(savedData){
					var password =  _selfInstance.getCustomMongoId("P");
					var message = "";
					
					if(savedData.origin==_selfInstance.leadType.post){
						message="Your post requirement has been successfully submitted"
					}else if(savedData.origin==_selfInstance.leadType.sell){
						message="Your selling requirement has been successfully submitted"
					}
					
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
                		 userSvc.on("done", function(code,msg,err,errValue){
					    	message = message+" "+msg;
					    	_selfInstance.emit("done",STATUS.OK.code,message,null,null);
					    });
                	} else{
                		_selfInstance.emit("done",STATUS.OK.code,message,null,null);
                	}
                	
					
				} else{
					_selfInstance.emit("done",STATUS.SERVER_ERROR.code,"Error capturing your requirement",err,null);
				}
			}
		})
	}) 
	_selfInstance.once("checkUserEvent",function(project){
 		
	 	IRXUserProfileModel.findOne({"irxId":data.dealerId},{"irxId":1},function(err,agents){
	 		
	 		if(err){
	 			console.error(err);
				_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
			}else {
				if(agents && agents != null){
					_selfInstance.emit("saveLeadEvent",project)
				} else {
					console.error("No agents found")
		 			_selfInstance.emit("done",404,"No agents found",null,null);
				}
				
			}
	 	})
		
	}) 

	// check for valid Project
	IRXProductLineModel.findOne({"id":data.projectId},{"id":1,"location":1},function(err,project){
		if(err){
			console.error(err);
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		} else {
			if(project== null){
				console.error("No project found")
		 		_selfInstance.emit("done",404,"No project found",null,null);
			}else if(data.dealerId && data.dealerId != ""){
				_selfInstance.emit("checkUserEvent",project)	
			}else{
				_selfInstance.emit("saveLeadEvent",project)
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
* Delete lead
*/
LeadService.prototype.leadDelete = function(data) {
	console.log("In leadDelete")
	var _selfInstance = this;
	
	IRXLeadModel.remove({"id":data.leadId},function(err){
		if (err) {
			console.error(err)
			_selfInstance.emit("done",mongoErr.resolveError(err.code).code,mongoErr.resolveError(err.code).msg,err,null);
		}else{
			console.log("Lead successfully deleted");
			_selfInstance.emit("done",STATUS.OK.code,"Lead successfully deleted",null,null);
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
	
	IRXLeadModel.find({"agentId":data.userId},{},{skip:start,limit:pageSize}).sort({"createdOn": -1}).exec(function(err , result){
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